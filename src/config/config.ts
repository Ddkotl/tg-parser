export type ParseChanelConfigData = {
  parsed_chanel_url: string;
  my_chanel_url_ru: string;
  my_chanel_url_en: string;
  post_count: number;
  diff_hour: number;
  system_ai_promt_ru: string;
  system_ai_promt_en: string;
  post_to_inst: boolean;
};
const standart_config_data = {
  post_count: 10,
  diff_hour: 2,
  system_ai_promt_ru: `
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
  `,
  system_ai_promt_en: `
  You are a professional Telegram channel editor.
  Tasks:
  - Make the content unique (paraphrase, add liveliness).
  - Translate into English if the text is not in English.
  - Remove ads and mentions of other channels.
  - Keep the essence and facts, format nicely in Telegram style.
  - Add relevant emojis in the main text (not in the headline).
  - Response structure:
    1. First line — catchy headline without emojis (essence of the post).
    2. A few paragraphs of text (readable, stylish, with light emojis).
    3. At the end 2–4 thematic hashtags separated by spaces.
                                                                                                                      
  Answer strictly in the format of a post, without comments or explanations.
  `,
};
export const chanels_parser_config: ParseChanelConfigData[] = [
  {
    parsed_chanel_url: "https://t.me/Goroskop",
    my_chanel_url_ru: "https://t.me/star_eliksir",
    my_chanel_url_en: "https://t.me/star_elixir",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    post_to_inst: false,
  },
  {
    parsed_chanel_url: "https://t.me/WatcherGuru",
    my_chanel_url_ru: "https://t.me/cripto_digest",
    my_chanel_url_en: "https://t.me/cripto_digest_en",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    post_to_inst: true,
  },
  {
    parsed_chanel_url: "https://t.me/investnetworkai1",
    my_chanel_url_ru: "https://t.me/blockchain_insaid",
    my_chanel_url_en: "https://t.me/blockchain_radars",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    post_to_inst: true,
  },
];
