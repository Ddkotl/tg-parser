import { parseChanel } from "./modules/parse_chanel.js";
import path from "node:path";
import dotenv from "dotenv";
import { createTgApiClient } from "./utils/api/tg_api_client_connect.js";
import { chanels_parser_config } from "./config/config.js";
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

  for (const config of chanels_parser_config) {
    await parseChanel({ client, config });
  }

  console.log("📨 Все задачи завершены.");
  await client.disconnect();
  process.exit(0);
})();
