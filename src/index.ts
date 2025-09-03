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
 const results = await Promise.allSettled(
    chanels_parser_config.map((conf) =>
      parseChanel({
        client,
        ...conf,
      })
    )
  );

  results.forEach((res, i) => {
    const conf = chanels_parser_config[i];
    if (res.status === "fulfilled") {
      console.log(`✅ Канал "${conf?.parsed_chanel_url}" успешно обработан`);
    } else {
      console.error(`❌ Ошибка в канале "${conf?.parsed_chanel_url}":`, res.reason);
    }
  });

  console.log("📨 Все задачи завершены.");
  await client.disconnect();
  process.exit(0);
})();
// 0 */3 * * * cd /home/dd/bash_scripsts/www/tg-parser && /home/dd/.nvm/versions/node/v20.18.0/bin/npm run start >> /home/dd/bash_scripsts/www/tg-parser/npm-start.log 2>&1
