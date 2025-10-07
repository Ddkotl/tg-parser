import { Api, type TelegramClient } from "telegram";
import { editTextToAi } from "../utils/ai/edit_text_to_ai.js";
import { safeAiAsk } from "../utils/ai/safe_ai_ask.js";
import { isAdPost } from "../utils/is_ad_post.js";
import { getLinkToImg } from "../utils/get_link_to_img.js";
import { publishToInstagram } from "../public_content/public_inst.js";
import { cleaneAiText } from "../utils/ai/cleane_ai_text.js";
import type { ParseChanelData } from "../types.js";
import { publishCarouselToInstagram } from "../public_content/publish_carusel_to_inst.js";

// helper для логов
function log(step: string, msg: string, icon: string = "ℹ️") {
  console.log(`[${new Date().toISOString()}] ${icon} ${step}: ${msg}`);
}

export async function parseChanel({ client, config }: ParseChanelData) {
  log("START", `Начинаем парсинг канала ${config.parsed_chanel_name}...`, "🚀");

  const channel = await client.getEntity(config.parsed_chanel_url);
  const messages = await client.getMessages(channel, {
    limit: config.post_count,
  });

  log("FETCH", `Найдено ${messages.length} сообщений в канале.`, "📩");

  let counter = 1;
  const exception: string[] = [];
  const start_parse_data = Date.now();

  for (const [idx, msg] of messages.reverse().entries()) {
    log("MESSAGE", `Обработка сообщения #${idx + 1}`, "⚡");

    const text = msg.message;
    if (!text) {
      log("SKIP", "Сообщение без текста", "⏭");
      continue;
    }

    if (msg.fwdFrom) {
      log("SKIP", "Пересланное сообщение", "⏭");
      continue;
    }
    if (msg.pinned) {
      log("SKIP", "Закрепленное сообщение", "⏭");
      continue;
    }
    if (!msg.post) {
      log("SKIP", "Не пост в канале", "⏭");
      continue;
    }

    const diff_hours = (Math.floor(start_parse_data / 1000) - msg.date) / (60 * 60);
    if (diff_hours >= config.diff_hour) {
      log("SKIP", `Сообщение старше ${config.diff_hour} часов`, "⏭");
      continue;
    }

    if (isAdPost(text)) {
      log("SKIP", "Определено как рекламный пост", "⏭");
      continue;
    }

    log("AI", "Отправляем текст на обработку AI...", "🤖");
    let modyfied_text_ru = await safeAiAsk(
      text,
      config.system_ai_promt_ru,
      editTextToAi,
      config.ai_temperature,
    );
    let modyfied_text_en = await safeAiAsk(
      text,
      config.system_ai_promt_en,
      editTextToAi,
      config.ai_temperature,
    );

    modyfied_text_ru = cleaneAiText(modyfied_text_ru);
    modyfied_text_en = cleaneAiText(modyfied_text_en);

    log(
      "AI",
      `Тексты подготовлены (RU: ${modyfied_text_ru.length} символов, EN: ${modyfied_text_en.length} символов).`,
      "✅",
    );

    const media = msg.media;

    if (msg.groupedId) {
      if (exception.includes(msg.groupedId.toString())) {
        log("SKIP", `Альбом с groupedId=${msg.groupedId} уже обработан`, "⏭");
        continue;
      }
      exception.push(msg.groupedId.toString());

      const album = messages.filter((m) => m.groupedId?.toString() === msg.groupedId?.toString());
      const files = album
        .filter((m) => m.media instanceof Api.MessageMediaPhoto)
        .map((m) => m.media as Api.MessageMediaPhoto);

      if (files.length > 0) {
        log("SEND", `Публикуем альбом (${files.length} фото) в каналы...`, "🖼");

        await client.sendFile(config.my_chanel_url_ru, {
          file: files,
          caption: modyfied_text_ru,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
          silent: true,
        });
        await client.sendFile(config.my_chanel_url_en, {
          file: files,
          caption: modyfied_text_en,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
          silent: true,
        });

        // Загрузка фото на Catbox
        const buffers: Buffer[] = [];
        for (const file of files) {
          const buf = await client.downloadMedia(file);
          if (buf && buf instanceof Buffer) buffers.push(buf);
        }

        if (buffers.length > 0) {
          log("UPLOAD", `Загружаем ${buffers.length} фото на Catbox...`, "☁️");
          const urls: string[] = [];
          for (let i = 0; i < buffers.length; i++) {
            const url = await getLinkToImg(buffers[i] as Buffer, `telegram_album_${i}.jpg`);
            urls.push(url);
          }
          log("UPLOAD", `Catbox URLs: ${urls.join(", ")}`, "🌐");
          await publishCarouselToInstagram({ text: modyfied_text_ru, imgs: urls });
        }
      }
    } else if (media && media instanceof Api.MessageMediaPhoto) {
      log("SEND", "Публикуем пост с фото в каналы...", "🖼");

      await client.sendFile(config.my_chanel_url_ru, {
        file: media,
        caption: modyfied_text_ru,
        scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      });
      await client.sendFile(config.my_chanel_url_en, {
        file: media,
        caption: modyfied_text_en,
        scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      });

      if (config.post_to_inst) {
        const buffer = await client.downloadMedia(msg);
        if (!buffer || !(buffer instanceof Buffer)) {
          log("ERROR", "Не удалось скачать медиа из Telegram", "❌");
          continue;
        }

        log("UPLOAD", "Загружаем фото на Catbox...", "☁️");
        const url = await getLinkToImg(buffer, "telegram.jpg");
        log("UPLOAD", `Catbox URL: ${url}`, "🌐");
        await publishToInstagram({ text: modyfied_text_ru, img: url });
      }
    } else {
      log("SEND", "Публикуем текстовый пост в каналы...", "📝");

      await client.sendMessage(config.my_chanel_url_ru, {
        message: modyfied_text_ru,
        schedule: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      });
      await client.sendMessage(config.my_chanel_url_en, {
        message: modyfied_text_en,
        schedule: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      });
    }

    counter++;
    log("DONE", `Сообщение #${counter - 1} успешно обработано.`, "✅");
  }

  log("END", `Парсинг канала ${config.parsed_chanel_name} завершен.`, "🏁");
}
