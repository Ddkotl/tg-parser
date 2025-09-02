import { Api, type TelegramClient } from "telegram";
import { safeTranslate } from "../utils/ai/safe_translate.js";
import { editTextToAi } from "../utils/ai/edit_text_to_ai.js";

export async function parseChanel({
  client,
  parsed_chanel_url,
  my_chanel_url,
  post_count,
  diff_hour,
}: {
  client: TelegramClient;
  parsed_chanel_url: string;
  my_chanel_url: string;
  post_count: number;
  diff_hour: number;
}) {
  const channel = await client.getEntity(parsed_chanel_url);
  const messages = await client.getMessages(channel, {
    limit: post_count,
  });
  let counter = 1;
  const exception: BigInt[] = [];
  for (const msg of messages.reverse()) {
    const text = msg.message || "";
    const modyfied_text = await safeTranslate(text, editTextToAi, 0.3);
    const media = msg.media;
    const date = msg.date;
    const diff_hours = (Math.floor(Date.now() / 1000) - date) / (60 * 60);
    if (diff_hours >= diff_hour) {
      continue;
    }
    if (msg.groupedId) {
      if (exception.includes(msg.groupedId)) {
        continue;
      }
      exception.push(msg.groupedId);
      const album = messages.filter((m) => m.groupedId === msg.groupedId);

      const caption = album[0]?.message ?? "";

      const files = album.filter((m) => m.media).map((m) => m.media as Api.MessageMediaPhoto);

      if (files.length > 0) {
        await client.sendFile(my_chanel_url, {
          file: files,
          caption,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        });
      }
    } else {
      if (media && media instanceof Api.MessageMediaPhoto) {
        await client.sendFile(my_chanel_url, {
          file: media,
          caption: modyfied_text,
          scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        });
      } else {
        await client.sendMessage(my_chanel_url, {
          message: modyfied_text,
          schedule: Math.floor(Date.now() / 1000) + counter * 60 * 5,
        });
      }
    }
    counter++;
  }
}
