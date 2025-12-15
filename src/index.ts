import { parseChanel } from "./modules/parse_chanel.js";
import path from "node:path";
import dotenv from "dotenv";
import { createTgApiClient } from "./utils/api/tg_api_client_connect.js";
import { chanels_parser_config } from "./config/config.js";
dotenv.config();

const apiId = process.env.TELEGRAM_CLIENT_API_ID;
const apiHash = process.env.TELEGRAM_CLIENT_API_HASH;
const SESSION_FILE = path.join(process.cwd(), "session.txt");
const PARSE_TIME_LIMIT_MS = 1.5 * 60 * 60 * 1000;

function timeoutPromise(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Операция превысила лимит по времени"));
    },PARSE_TIME_LIMIT_MS);
  });
}

(async () => {
  const client = await createTgApiClient({
    apiId: apiId,
    apiHash: apiHash,
    SESSION_FILE: SESSION_FILE,
  });

  await Promise.race([
    (async () => {
      for (const config of chanels_parser_config) {
        await parseChanel({ client, config });
      }
    })(),
    timeoutPromise(PARSE_TIME_LIMIT_MS),
  ]);

  console.log("📨 Все задачи завершены.");
  await client.disconnect();
  process.exit(0);
})();
