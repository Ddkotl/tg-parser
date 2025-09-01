import { Api, type TelegramClient } from "telegram";
import { safeTranslate } from "../utils/ai/safe_translate.js";
import { translateText } from "../utils/ai/translate_text.js";

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
  for (const msg of messages.reverse()) {
    const text = msg.message || "";
    const modyfied_text = await safeTranslate(text,translateText,"",0.5)
    console.log(modyfied_text)
    const media = msg.media;
    const date = msg.date;
    const diff_hours = (Math.floor(Date.now() / 1000) - date) / (60 * 60);
    if (diff_hours >= diff_hour) {
      continue;
    }
    if (media && media instanceof Api.MessageMediaPhoto) {
      await client.sendFile(my_chanel_url, {
        file: media,
        caption: `${modyfied_text}`,
        scheduleDate: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      });
    } else {
      await client.sendMessage(my_chanel_url, {
        message: `${modyfied_text}`,
        schedule: Math.floor(Date.now() / 1000) + counter * 60 * 5,
      });
    }
    counter++;
  }
}
