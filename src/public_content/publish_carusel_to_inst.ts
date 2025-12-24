import dotenv from "dotenv";
dotenv.config();

const GRAPH_VERSION = "v22.0";
const GRAPH_URL = "https://graph.facebook.com";

/**
 * Ожидание готовности media-container
 */
async function waitForMediaReady(mediaId: string, token: string, timeoutMs = 60000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const res = await fetch(
      `${GRAPH_URL}/${GRAPH_VERSION}/${mediaId}?fields=status_code&access_token=${token}`,
    );

    const data = await res.json();

    if (data.status_code === "FINISHED") {
      return;
    }

    if (data.status_code === "ERROR") {
      throw new Error(`Media ${mediaId} failed processing`);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error(`Timeout waiting for media ${mediaId}`);
}

export async function publishCarouselToInstagram({ text, imgs }: { text: string; imgs: string[] }) {
  const face_token = process.env.FACEBOOK_ACCESS_TOKEN;
  const inst_id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!face_token || !inst_id) {
    console.log("❌ Нет токена или Instagram ID");
    return false;
  }

  const children: string[] = [];

  /**
   * 1. Создаём image-container’ы
   */
  for (const img of imgs) {
    const params = new URLSearchParams({
      image_url: img,
      is_carousel_item: "true",
      access_token: face_token,
    });

    const res = await fetch(`${GRAPH_URL}/${GRAPH_VERSION}/${inst_id}/media`, {
      method: "POST",
      body: params,
    });

    const data = await res.json();

    if (data.error) {
      console.log("Ошибка создания image-container:", data.error);
      continue;
    }

    children.push(data.id);
  }

  if (!children.length) {
    console.log("❌ Image-container’ы не созданы");
    return false;
  }

  /**
   * 2. Ждём готовность каждого image-container
   */
  for (const id of children) {
    await waitForMediaReady(id, face_token);
  }

  /**
   * 3. Создаём carousel-container
   */
  const carouselParams = new URLSearchParams({
    media_type: "CAROUSEL",
    caption: text,
    children: children.join(","),
    access_token: face_token,
  });

  const carouselRes = await fetch(`${GRAPH_URL}/${GRAPH_VERSION}/${inst_id}/media`, {
    method: "POST",
    body: carouselParams,
  });

  const carouselData = await carouselRes.json();

  if (!carouselData.id) {
    console.log("Ошибка создания карусели:", carouselData);
    return false;
  }

  /**
   * 4. Ждём готовность carousel-container
   */
  await waitForMediaReady(carouselData.id, face_token);

  /**
   * 5. Публикуем
   */
  const publishParams = new URLSearchParams({
    creation_id: carouselData.id,
    access_token: face_token,
  });

  const publishRes = await fetch(`${GRAPH_URL}/${GRAPH_VERSION}/${inst_id}/media_publish`, {
    method: "POST",
    body: publishParams,
  });

  const publishData = await publishRes.json();

  if (publishData.error) {
    console.log("Ошибка публикации:", publishData.error);
    return false;
  }

  console.log("✅ Карусель опубликована:", publishData.id);
  return true;
}

/**
 * Тестовый запуск
 */
//(async () => {
//  await publishCarouselToInstagram({
//   text: "test carousel",
//    imgs: [
//     "https://cdn.pixabay.com/photo/2024/05/30/22/14/bird-8799413_1280.jpg",
//     "https://cdn.pixabay.com/photo/2024/05/30/22/14/bird-8799413_1280.jpg",
//     "https://cdn.pixabay.com/photo/2024/05/30/22/14/bird-8799413_1280.jpg",
//   ],
//  });
//})();
