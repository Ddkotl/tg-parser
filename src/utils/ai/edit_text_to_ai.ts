import { openai } from "../api/ai_api_connect.js";

export const editTextToAi = async (
  ai_model: string,
  text: string,
  system_promt: string,
  temperature?: number,
): Promise<string> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: ai_model,
      temperature: temperature ?? 0.5,
      messages: [
        {
          role: "system",
          content: system_promt,
        },
        {
          role: "user",
          content: `${system_promt}. Вот исходный текст:  ${text}`,
        },
      ],
    });

    return chatCompletion.choices[0]?.message?.content ?? "";
  } catch (e) {
    console.error("ai process post error", e);
    return "";
  }
};
