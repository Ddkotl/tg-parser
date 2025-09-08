import { sleep } from "../sleep.js";

const ERROR_PATTERNS = [
  "не могу выполнить",
  "не могу обработать",
  "не могу предоставить",
  "это нарушает авторское право",
  "не могу перевести",
  "не могу выполнить этот запрос",
  "не могу помочь с этим",
  "это запрещено",
  "не могу создать этот контент",
  "не могу ответить на этот запрос",
  "не имею права",
  "это нарушает политику",
  "не могу выполнить ваш запрос",
  "извините, но я не могу",
  "не могу предоставить этот перевод",
  "мне запрещено это делать",
  "это противоречит правилам",
  "это не допускается",
  "я не могу обработать этот текст",
  "не могу предоставить ответ",
  "не имею возможности обработать этот запрос",
  "авторские права",
  "i cannot process",
  "i can't translate",
  "this violates copyright",
  "i'm sorry, but i can't do that",
  "i am unable to complete this request",
  "i cannot generate this content",
  "this request is against policy",
  "i can't assist with that",
  "i am unable to provide this translation",
  "i am not allowed to process this",
  "i am restricted from generating this",
  "this is not permitted",
  "i cannot comply with this request",
  "i am unable to generate this response",
  "i cannot help with this request",
  "this content violates our guidelines",
  "this request is not allowed",
  "Request",
  "request",
  "requests",
  "request limit",
  "requests limit",
  "error",
  "bot limit",
  "limit exceeded",
  "blocked by",
  "prohibited",
  "rate limit",
  "rate limit of this model",
  "limit of this model is reached",
  "502 Bad Gateway",
  "502",
];

const containsError = (response: string): boolean => {
  if (response.length >= 1000) {
    console.log(`[containsError] Ответ слишком длинный: ${response.length} символов`);
    return true;
  }
  const lower = response.toLowerCase();
  const match = ERROR_PATTERNS.find((pattern) => lower.includes(pattern));

  if (match) {
    console.log(`[containsError] Найдена ошибка! Шаблон: "${match}" в ответе: "${response}"`);
    return true;
  }

  return false;
};

export const safeAiAsk = async (
  text: string,
  system_promt: string,
  aiFunction: (text: string, system_promt: string, temperature?: number) => Promise<string>,
  temperature?: number,
  retries: number = 50,
): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    try {
      await sleep(1000);
      const response = await aiFunction(text, system_promt, temperature);
      if (response && !containsError(response)) {
        return response;
      }
      console.log(`Попытка ${i + 1} не удалась, повторяем...`);
    } catch (error) {
      console.log(`Ошибка перевода (попытка ${i + 1}):`, error);
    }
    await sleep(5000);
  }
  console.log("Превышено количество попыток. Операция не выполнена.");
  return "";
};
