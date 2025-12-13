import dotenv from "dotenv";
dotenv.config();

export async function publishToInstagram({ text, img }: { text: string; img: string }) {
  try {
    const face_token = process.env.FACEBOOK_ACCESS_TOKEN;
    const inst_id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    if (!face_token || !inst_id) {
      console.log("Не настроены параметры для публикации в Instagram");
      return;
    }

    const creationResponse = await fetch(`https://graph.facebook.com/v22.0/${inst_id}/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: img,
        caption: text,
        access_token: face_token,
      }),
    });

    const creationData = await creationResponse.json();
    const creationId = creationData.id;

    if (!creationId) {
      throw new Error("Не удалось создать контейнер медиа");
    }

    // 2. Публикуем контейнер
    const publishResponse = await fetch(
      `https://graph.facebook.com/v22.0/${inst_id}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: face_token,
        }),
      },
    );

    const publishData = await publishResponse.json();

    if (publishData.error) {
      throw new Error(publishData.error.message);
    }

    console.log("Пост успешно опубликован в Instagram! ID:", publishData.id);
  } catch (error) {
    console.log("Ошибка при публикации поста в Instagram:", error);
  }
}

//(async () => {
 //  await publishToInstagram({
//text: "test",
 //img: "https://cdn.pixabay.com/photo/2024/05/30/22/14/bird-8799413_1280.jpg",
 //});
//})();

