export async function parseChanel(chanel_url: string) {
  const channel = await client.getEntity(CHANNEL_USERNAME);

  // Получаем последние N сообщений
  const messages = await client.getMessages(channel, { limit: POST_LIMIT });

  for (const msg of messages) {
    if (msg.message) console.log("\n📝 Текст поста:", msg.message);

    if (msg.media) {
      // Пробуем получить ссылку на сам пост
      try {
        const link = await client.invoke(
          new Api.channels.ExportMessageLink({
            channel: channel as any,
            id: msg.id,
          }),
        );
        console.log(`🔗 Ссылка на пост: ${link.link}`);
      } catch (e) {
        console.log("⚠️ Не удалось получить ссылку на пост:", e);
      }

      // Если есть фото
      if (msg.photo) {
        const sizes = msg.photo.sizes;
        const biggest = sizes[sizes.length - 1]; // берём максимальное качество
        console.log(
          `📷 Фото доступно в посте: https://t.me/${CHANNEL_USERNAME}/${msg.id}`,
        );
      }

      // Если есть видео или документ
      if (msg.document) {
        console.log(
          `🎬 Видео/файл доступен в посте: https://t.me/${CHANNEL_USERNAME}/${msg.id}`,
        );
      }
    }
  }
}
