export async function publishCarouselToInstagram({ text, imgs }: { text: string; imgs: string[] }) {
  try {
    const face_token = process.env.FACEBOOK_ACCESS_TOKEN;
    const inst_id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!face_token || !inst_id) {
      console.log("⚠️ Не настроены параметры для публикации в Instagram");
      return false;
    }

    // шаг 1: создаём контейнеры для фоток
    const children: string[] = [];
    for (const img of imgs) {
      const res = await fetch(`https://graph.facebook.com/v22.0/${inst_id}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: img,
          is_carousel_item: true,
          access_token: face_token,
        }),
      });

      const data = await res.json();
      if (data.error) {
        console.log("Ошибка при создании контейнера:", data.error);
        continue;
      }
      if (data.id) children.push(data.id);
    }

    if (!children.length) {
      console.log("⚠️ Не удалось создать контейнеры для фото");
      return false;
    }

    // шаг 2: создаём carousel-контейнер
    const carouselRes = await fetch(`https://graph.facebook.com/v22.0/${inst_id}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption: text,
        children,
        media_type: "CAROUSEL",
        access_token: face_token,
      }),
    });

    const carouselData = await carouselRes.json();
    if (carouselData.error) {
      console.log("Ошибка при создании карусели:", carouselData.error);
      return false;
    }

    // шаг 3: публикуем
    const publishRes = await fetch(`https://graph.facebook.com/v22.0/${inst_id}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: carouselData.id,
        access_token: face_token,
      }),
    });

    const publishData = await publishRes.json();
    if (publishData.error) {
      console.log("Ошибка при публикации карусели:", publishData.error);
      return false;
    }

    console.log("✅ Карусель опубликована в Instagram, ID:", publishData.id);
    return true;
  } catch (err) {
    console.log("Ошибка в publishCarouselToInstagram:", err);
    return false;
  }
}
