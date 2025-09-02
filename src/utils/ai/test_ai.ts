import { openai } from "../api/ai_api_connect.js";

async function test() {
  const res = await openai.chat.completions.create({
    model: `${process.env.AI_MODEL}`,
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
