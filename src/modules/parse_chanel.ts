import { Api, type TelegramClient } from "telegram";
import { editTextToAi } from "../utils/ai/edit_text_to_ai.js";
import { safeAiAsk } from "../utils/ai/safe_ai_ask.js";
import { isAdPost } from "../utils/is_ad_post.js";
import { getLinkToImg } from "../utils/get_link_to_img.js";
import { publishToInstagram } from "../public_content/public_inst.js";
import { cleaneAiText } from "../utils/ai/cleane_ai_text.js";
import type { ParseChanelData } from "../types.js";

export async function parseChanel({ client, config }: ParseChanelData) {
  const channel = await client.getEntity(config.parsed_chanel_url);
  const messages = await client.getMessages(channel, {
    limit: config.post_count,
  });

  let counter = 1;
  const exception: string[] = [];

  for (const msg of messages.reverse()) {
    if (msg.fwdFrom || msg.pinned || !msg.post) continue;
    const text = msg.message;
    if (!text) continue;
    const media = msg.media;
    const date = msg.date;
    const diff_hours = (Math.floor(Date.now() / 1000) - date) / (60 * 60);
    if (diff_hours >= config.diff_hour) {
      continue;
    }
    const is_ad_post = isAdPost(text);
    if (is_ad_post) continue;
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
    if (msg.groupedId) {
      if (exception.includes(msg.groupedId.toString())) {
        continue;
      }
      exception.push(msg.groupedId.toString());
      const album = messages.filter((m) => m.groupedId?.toString() === msg.groupedId?.toString());
      const files = album
        .filter((m) => m.media instanceof Api.MessageMediaPhoto)
        .map((m) => m.media as Api.MessageMediaPhoto);
      if (files.length > 0) {
        await client.sendFile(config.my_chanel_url_ru, {
          file: files,
          caption: modyfied_text_ru,
          forceDocument: false,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        });
        await client.sendFile(config.my_chanel_url_en, {
          file: files,
          caption: modyfied_text_en,
          forceDocument: false,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        });
      }
    } else if (media && media instanceof Api.MessageMediaPhoto) {
      (await client.sendFile(config.my_chanel_url_ru, {
        file: media,
        caption: modyfied_text_ru,
        scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      }),
        await client.sendFile(config.my_chanel_url_en, {
          file: media,
          caption: modyfied_text_en,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        }));
      if (config.post_to_inst) {
        const buffer = await client.downloadMedia(msg);
        if (!buffer || !(buffer instanceof Buffer)) {
          console.log("Не удалось скачать медиа из Telegram");
          continue;
        }

        const url = await getLinkToImg(buffer, "telegram.jpg");
        console.log("Catbox URL:", url);
        await publishToInstagram({ text: modyfied_text_ru, img: url });
      }
    } else {
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
  }
}
