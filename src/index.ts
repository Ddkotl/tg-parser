import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import * as readline from "node:readline";
import dotenv from "dotenv"
dotenv.config()

const apiId = process.env.TELEGRAM_CLIENT_API_ID;
const apiHash = process.env.TELEGRAM_CLIENT_API_HASH
let stringSession = new StringSession(""); // fill this later with the value from session.save()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  if(!apiHash || !apiId){
    return
  }
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, +apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your number: ", resolve),
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your password: ", resolve),
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question("Please enter the code you received: ", resolve),
      ),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session)
  await client.sendMessage("me", { message: "Hello!" });
})();
