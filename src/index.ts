import { parseChanel } from "./modules/parse_chanel.js";
import path from "node:path";
import dotenv from "dotenv";
import { createTgApiClient } from "./utils/api/tg_api_client_connect.js";
dotenv.config();

const apiId = process.env.TELEGRAM_CLIENT_API_ID;
const apiHash = process.env.TELEGRAM_CLIENT_API_HASH;
const SESSION_FILE = path.join(process.cwd(), "session.txt");

(async () => {
  const client = await createTgApiClient({
    apiId: apiId,
    apiHash: apiHash,
    SESSION_FILE: SESSION_FILE,
  });

  await parseChanel({
    client: client,
    parsed_chanel_url: "https://t.me/Goroskop",
    my_chanel_url: "me",
    post_count: 10,
    diff_hour: 60,
  });
  console.log("📨 Сообщение отправлено.");
  await client.disconnect();
  process.exit(0);
})();
