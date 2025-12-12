import * as fs from "node:fs";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/StringSession.js";
import { ask } from "../ask_in_terminal.js";
import dotenv from "dotenv";
dotenv.config();
export async function createTgApiClient({
  apiId,
  apiHash,
  SESSION_FILE,
}: {
  apiId: string | undefined;
  apiHash: string | undefined;
  SESSION_FILE: string;
}): Promise<TelegramClient> {
  let sessionString = process.env.SESSION;

  if (!sessionString && fs.existsSync(SESSION_FILE)) {
    sessionString = fs.readFileSync(SESSION_FILE, "utf8");
  }
  let stringSession = new StringSession(sessionString);

  if (!apiHash || !apiId) {
    console.error("❌ Не заданы TELEGRAM_CLIENT_API_ID или TELEGRAM_CLIENT_API_HASH");
    process.exit(1);
  }

  console.log("🔄 Подключение к Telegram...");

  const client = new TelegramClient(stringSession, +apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await ask("📱 Введите номер телефона: "),
    password: async () => await ask("🔑 Введите пароль 2FA (если есть, иначе Enter): "),
    phoneCode: async () => await ask("📩 Введите код из Telegram: "),
    onError: (err) => console.error("❌ Ошибка авторизации:", err),
  });

  console.log("✅ Успешно подключились!");

  fs.writeFileSync(SESSION_FILE, stringSession.save());
  console.log("💾 Сессия сохранена в", SESSION_FILE);

  return client;
}
