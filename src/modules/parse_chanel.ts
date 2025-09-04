import { Api, type TelegramClient } from "telegram";
import { editTextToAi } from "../utils/ai/edit_text_to_ai.js";
import { safeAiAsk } from "../utils/ai/safe_ai_ask.js";

export async function parseChanel({
  client,
  parsed_chanel_url,
  my_chanel_url_ru,
  my_chanel_url_en,
  post_count,
  diff_hour,
  system_ai_promt_ru,
  system_ai_promt_en,
}: {
  client: TelegramClient;
  parsed_chanel_url: string;
  my_chanel_url_ru: string;
  my_chanel_url_en: string;
  post_count: number;
  diff_hour: number;
  system_ai_promt_ru: string;
  system_ai_promt_en: string;
}) {
  const channel = await client.getEntity(parsed_chanel_url);
  const messages = await client.getMessages(channel, {
    limit: post_count,
  });
  // console.log("mesgs", messages.length);
  // messages.forEach((msg) => {
  //   console.log({
  //     id: msg.id,
  //     text: msg.message?.substring(0, 50), // первые 50 символов
  //     date: msg.date,
  //     is_outgoing: msg.out, // отправлено ли твоим аккаунтом
  //     is_forwarded: msg.fwdFrom, // пересланное сообщение
  //     is_scheduled: msg.fromScheduled, // отложенное сообщение
  //     groupid: msg.groupedId,
  //     media:!!msg.media,
  //     editHide: msg.editHide,
  //     legacy:msg.legacy,
  //     restricion:msg.restrictionReason
  //   });
  // });
  let counter = 1;
  const exception: string[] = [];
  for (const msg of messages.reverse()) {
    if (msg.fwdFrom) continue;
    if (msg.editHide || msg.legacy || msg.restrictionReason) continue;
    const text = msg.message;
    if (!text) continue;
    if (!text && !msg.media && !msg.groupedId) continue;
    console.log("text", text.slice(0, 50));
    const [modyfied_text_ru, modyfied_text_en] = await Promise.all([
      safeAiAsk(text, system_ai_promt_ru, editTextToAi, 0.3),
      safeAiAsk(text, system_ai_promt_en, editTextToAi, 0.3),
    ]);
    console.log("ru", modyfied_text_ru.slice(0, 50));
    console.log("en", modyfied_text_en.slice(0, 50));
    const media = msg.media;
    const date = msg.date;
    // const diff_hours = (Math.floor(Date.now() / 1000) - date) / (60 * 60);
    // if (diff_hours >= diff_hour) {
    // continue;
    //}
    if (msg.groupedId !== undefined && msg.groupedId !== null) {
      if (exception.includes(msg.groupedId.toString())) {
        continue;
      }
      exception.push(msg.groupedId.toString());
      const album = messages.filter((m) => m.groupedId?.toString() === msg.groupedId?.toString());
      const files = album
        .filter((m) => m.media instanceof Api.MessageMediaPhoto)
        .map((m) => m.media as Api.MessageMediaPhoto);
      if (files.length > 0) {
        await Promise.allSettled([
          client.sendFile(my_chanel_url_ru, {
            file: files,
            caption: modyfied_text_ru,
            forceDocument: false,
            scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
          }),
          client.sendFile(my_chanel_url_en, {
            file: files,
            caption: modyfied_text_en,
            forceDocument: false,
            scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
          }),
        ]);
      }
    } else if (media && media instanceof Api.MessageMediaPhoto) {
      await Promise.allSettled([
        client.sendFile(my_chanel_url_ru, {
          file: media,
          caption: modyfied_text_ru,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        }),
        client.sendFile(my_chanel_url_en, {
          file: media,
          caption: modyfied_text_en,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        }),
      ]);
    } else {
      await Promise.allSettled([
        client.sendMessage(my_chanel_url_ru, {
          message: modyfied_text_ru,
          schedule: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        }),
        client.sendMessage(my_chanel_url_en, {
          message: modyfied_text_en,
          schedule: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        }),
      ]);
    }
    counter++;
  }
}
