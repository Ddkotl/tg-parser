import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function main() {
  const completion = await openai.chat.completions.create({
    model: `${process.env.AI_MODEL}`,
    messages: [
      {
        role: "user",
        content: "привет",
      },
    ],
  });
  if (completion.choices[0]?.message) {
    console.log(completion.choices[0].message.content);
  }
}
