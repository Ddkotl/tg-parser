export async function publishCarouselToInstagram({ text, imgs }) {
  const face_token = process.env.FACEBOOK_ACCESS_TOKEN;
  const inst_id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!face_token || !inst_id) return false;

  const children: string[] = [];

  for (const img of imgs) {
    const params = new URLSearchParams({
      image_url: img,
      is_carousel_item: "true",
      access_token: face_token,
    });

    const res = await fetch(
      `https://graph.facebook.com/v22.0/${inst_id}/media`,
      { method: "POST", body: params }
    );

    const data = await res.json();

    if (data.error) {
      console.log("Ошибка контейнера:", data.error);
      continue;
    }

    children.push(data.id);
  }

  if (!children.length) {
    console.log("❌ Контейнеры не созданы");
    return false;
  }

  // ⏳ ждём готовность
  await new Promise(r => setTimeout(r, 2000));

  const carouselParams = new URLSearchParams({
    media_type: "CAROUSEL",
    caption: text,
    children: children.join(","),
    access_token: face_token,
  });

  const carouselRes = await fetch(
    `https://graph.facebook.com/v22.0/${inst_id}/media`,
    { method: "POST", body: carouselParams }
  );

  const carouselData = await carouselRes.json();
  if (!carouselData.id) {
    console.log("Ошибка карусели:", carouselData);
    return false;
  }

  const publishParams = new URLSearchParams({
    creation_id: carouselData.id,
    access_token: face_token,
  });

  const publishRes = await fetch(
    `https://graph.facebook.com/v22.0/${inst_id}/media_publish`,
    { method: "POST", body: publishParams }
  );

  const publishData = await publishRes.json();

  if (publishData.error) {
    console.log("Ошибка публикации:", publishData.error);
    return false;
  }

  console.log("✅ Карусель опубликована:", publishData.id);
  return true;
}
