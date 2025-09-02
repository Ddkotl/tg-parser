import { openai } from "../api/ai_api_connect.js";

export const editTextToAi = async (text: string, temperature?: number): Promise<string> => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: `${process.env.AI_MODEL}`,
      temperature: temperature ?? 0.5,
      messages: [
        {
          role: "system",
          content: `
          Ты профессиональный редактор Telegram-канала. 
          Задачи:
          - Сделай уникальный контент (перефразируй текст, добавь живости).
          - Переведи на русский язык, если текст не на русском.
          - Удали рекламу и упоминания чужих каналов.
          - Сохрани суть и факты, оформи красиво в стиле Telegram.
          - Добавь уместные эмодзи в основной текст (не в заголовке).
          - Структура ответа:
            1. Первая строка — цепляющий заголовок без эмодзи(суть поста).
              2. Несколько абзацев текста (читаемо, красиво, с лёгкими эмодзи).
                3. В конце 2–4 тематических хэштега через пробел.
                  
                  Отвечай строго в формате поста, без комментариев и пояснений.
       ` },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return chatCompletion.choices[0]?.message?.content ?? "";
  } catch (e) {
    console.error("ai process post error", e);
    return "";
  }
}
