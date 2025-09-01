import { openai } from "../api/ai_api_connect.js";

export const translateText = async (
  text: string,
  context?: string,
  temperature?: number,
): Promise<string> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Отвечай на русcком языке  строго в  формате строки ,  без добавления комментариев.",
        },
        {
          role: "user",
          content: `Переведи ${context} на русский так, чтобы он звучал естественно для русскоязычного читателя.
                    Ответь строго строкой.
                    Не добавляй комментарии,вопросы, пояснения, символы(\`'"/|\<>)
                    Вот текст для перевода:
                    ${text}`,
        },
      ],
      temperature: temperature ? temperature : 0,
      model: `${process.env.AI_MODEL}`,
    });
    return chatCompletion?.choices[0]?.message.content as string;
  } catch (e) {
    console.error("ai translate text error", e);
    return "";
  }
};
