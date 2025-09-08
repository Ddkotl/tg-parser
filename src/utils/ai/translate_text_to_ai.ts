import type { SupportedLang } from "../../types.js";
import { openai } from "../api/ai_api_connect.js";

export const translateTextToAi = async (
  ai_model: string,
  text: string,
  targetLang: SupportedLang,
  temperature?: number,
): Promise<string> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: ai_model,
      temperature: temperature ?? 0.2,
      messages: [
        {
          role: "system",
          content: `
            Ты профессиональный переводчик.
            Переводи текст на указанный язык: ${targetLang}.
            Сохрани исходный смысл и форматирование (абзацы, разметку, эмодзи).
            Не добавляй ничего от себя — только перевод.
        `,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return chatCompletion.choices[0]?.message?.content ?? "";
  } catch (e) {
    console.error("ai translation error", e);
    return "";
  }
};
