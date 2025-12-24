import dotenv from "dotenv";
dotenv.config();

const GRAPH_VERSION = "v22.0";
const GRAPH_URL = "https://graph.facebook.com";

async function waitForMediaReady(mediaId: string, token: string, timeoutMs = 60000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const res = await fetch(
      `${GRAPH_URL}/${GRAPH_VERSION}/${mediaId}?fields=status_code&access_token=${token}`,
    );

    const data = await res.json();

    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") {
      throw new Error(`Media ${mediaId} processing failed`);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error(`Timeout waiting for media ${mediaId}`);
}

export async function publishToInstagram({ text, img }: { text: string; img: string }) {
  const face_token = process.env.FACEBOOK_ACCESS_TOKEN;
  const inst_id = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!face_token || !inst_id) {
    console.log("❌ Нет токена или Instagram ID");
    return false;
  }

  // 1. Создаём container
  const params = new URLSearchParams({
    image_url: img,
    caption: text,
    access_token: face_token,
  });

  const creationRes = await fetch(`${GRAPH_URL}/${GRAPH_VERSION}/${inst_id}/media`, {
    method: "POST",
    body: params,
  });

  const creationData = await creationRes.json();

  if (!creationData.id) {
    console.log("Ошибка создания контейнера:", creationData);
    return false;
  }

  // 2. Ждём готовность
  await waitForMediaReady(creationData.id, face_token);

  // 3. Публикуем
  const publishParams = new URLSearchParams({
    creation_id: creationData.id,
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

  console.log("✅ Пост опубликован:", publishData.id);
  return true;
}

//(async () => {
// await publishToInstagram({
//text: "test",
//img: "https://cdn.pixabay.com/photo/2024/05/30/22/14/bird-8799413_1280.jpg",
//});
//})();
