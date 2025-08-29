import { type TelegramClient } from "telegram";

export async function parseChanel(
  client: TelegramClient,
  chanel_url: string,
  post_count: number,
) {
  const channel = await client.getEntity(chanel_url);
  const messages = await client.getMessages(channel, {
    limit: post_count,
  });

  for (const msg of messages) {
    if (msg.message)
     await client.sendMessage("me",{message: `📝 Текст поста: ${msg.message}`})
  }
}
