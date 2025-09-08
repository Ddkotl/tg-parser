import { openai, TEXT_AI_MODELS } from "../api/ai_api_connect.js";

async function test() {
  const res = await openai.chat.completions.create({
    model: `${TEXT_AI_MODELS[0]}`,
    messages: [
      {
        role: "system",
        content:
          "Отвечай на русcком языке  строго в  формате строки ,  без добавления комментариев.",
      },
      { role: "user", content: "Hello" },
    ],
  });
  console.log(res?.choices[0]?.message.content);
}
test();
