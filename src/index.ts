import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import * as readline from "node:readline";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const apiId = process.env.TELEGRAM_CLIENT_API_ID;
const apiHash = process.env.TELEGRAM_CLIENT_API_HASH;
const SESSION_FILE = "./session.txt";

// Загружаем сессию, если она есть
let sessionString = "";
if (fs.existsSync(SESSION_FILE)) {
  sessionString = fs.readFileSync(SESSION_FILE, "utf8");
}
let stringSession = new StringSession(sessionString);

// Функция для ввода через терминал
function ask(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

(async () => {
  if (!apiHash || !apiId) {
    console.error(
      "❌ Не заданы TELEGRAM_CLIENT_API_ID или TELEGRAM_CLIENT_API_HASH",
    );
    process.exit(1);
  }

  console.log("🔄 Подключение к Telegram...");

  const client = new TelegramClient(stringSession, +apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await ask("📱 Введите номер телефона: "),
    password: async () =>
      await ask("🔑 Введите пароль 2FA (если есть, иначе Enter): "),
    phoneCode: async () => await ask("📩 Введите код из Telegram: "),
    onError: (err) => console.error("❌ Ошибка авторизации:", err),
  });

  console.log("✅ Успешно подключились!");

  // Сохраняем обновлённую сессию
  fs.writeFileSync(SESSION_FILE, stringSession.save());
  console.log("💾 Сессия сохранена в", SESSION_FILE);

  // Пример: отправка сообщения себе
  await client.sendMessage("me", { message: "Hello!" });

  console.log("📨 Сообщение отправлено.");
  await client.disconnect();
  process.exit(0);
})();
