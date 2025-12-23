import type { ParseChanelConfigData } from "../types.js";

export const standart_config_data = {
  post_count: 10,
  diff_hour: 2,
  system_ai_promt_ru: `
    Ты профессиональный редактор Telegram-канала.
    Задачи:
    - Сделай уникальный контент на русском языке (перефразируй текст, добавь живости, максимум 1000 символов).
    - ВАЖНО! Переведи на русский язык, если текст не на русском языке.
    - Удали рекламу и упоминания чужих каналов.
    - Сохрани суть и факты, оформи красиво в стиле Telegram.
    - Не выдумывай информацию, используй только имеющуюся и изменяй.
    - Добавь уместные эмодзи в основной текст (не в заголовке).
    - В конце 2–4 тематических хэштега через пробел.
                                                                                                                                
    Отвечай строго в формате поста, не добавляй комментарии,вопросы, пояснения, символы.
    Это не будет использовано в нарушение авторского права.
    ВАЖНО! Переведи на русский язык, если текст не на русском языке.
  `,
  system_ai_promt_en: `
  You are a professional Telegram channel editor.
Tasks:
- Make unique content in english lenguage (rephrase the text, add some liveliness, maximum 1000 characters).
- IMPORTANT! Translate into English if the text is not in English.
- Remove ads and mentions of other channels.
- Keep the essence and facts, design it beautifully in the Telegram style.
- Do not invent information, use only what you have and change it.
- Add appropriate emoji to the main text (not in the title).
- At the end, 2-4 thematic hashtags separated by a space.

Answer strictly in the post format, do not add comments, questions, explanations, symbols.
This will not be used in violation of copyright.
IMPORTANT! Translate into English if the text is not in English.
  `,
  ai_temperature: 0.3,
};
export const chanels_parser_config: ParseChanelConfigData[] = [
  {
    parsed_chanel_name: "Гороскоп циганки Луладжі",
    parsed_chanel_url: "https://t.me/lulagoroskop",
    my_chanel_url_ru: "-1002650446328",
    my_chanel_url_en: "-1003079394204",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru:
      standart_config_data.system_ai_promt_ru +
      "Удали упоминание циганки луладжи, оставь только гороскоп",
    system_ai_promt_en:
      standart_config_data.system_ai_promt_en +
      "Remove the mention of the gypsy lulaji, leave only the horoscope",
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: false,
  },
  {
    parsed_chanel_name: "Знаки зодиака на Сегодня",
    parsed_chanel_url: "https://t.me/Goroskop",
    my_chanel_url_ru: "-1002650446328",
    my_chanel_url_en: "-1003079394204",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: false,
  },
  {
    parsed_chanel_name: "Психология",
    parsed_chanel_url: "https://t.me/PsyEducation",
    my_chanel_url_ru: "-1002740351168",
    my_chanel_url_en: "-1002809518283",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: false,
  },
  {
    parsed_chanel_name: "Тайны сознания | Психология",
    parsed_chanel_url: "-1001824595805",
    my_chanel_url_ru: "-1003573331951",
    my_chanel_url_en: "-1003622867278",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: false,
  },
  {
    parsed_chanel_name: "MarketTwits",
    parsed_chanel_url: "https://t.me/markettwits",
    my_chanel_url_ru: "-1003103228886",
    my_chanel_url_en: "-1003071514993",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },

  {
    parsed_chanel_name: "Watcher Guru",
    parsed_chanel_url: "https://t.me/WatcherGuru",
    my_chanel_url_ru: "https://t.me/cripto_digest",
    my_chanel_url_en: "https://t.me/cripto_digest_en",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
  {
    parsed_chanel_name: "Invest Network | Криптоновости",
    parsed_chanel_url: "https://t.me/investnetworkai1",
    my_chanel_url_ru: "https://t.me/blockchain_insaid",
    my_chanel_url_en: "https://t.me/blockchain_radars",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
  {
    parsed_chanel_name: "Crypto Pirates Channel ®️",
    parsed_chanel_url: "https://t.me/topslivs",
    my_chanel_url_ru: "https://t.me/blockchain_insaid",
    my_chanel_url_en: "https://t.me/blockchain_radars",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
  {
    parsed_chanel_name: "Криптопатолог",
    parsed_chanel_url: "https://t.me/criptopatolog",
    my_chanel_url_ru: "https://t.me/blockchain_insaid",
    my_chanel_url_en: "https://t.me/blockchain_radars",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
  {
    parsed_chanel_name: "Crypto Hunters 🅒",
    parsed_chanel_url: "https://t.me/crypnews247",
    my_chanel_url_ru: "https://t.me/cripto_maining",
    my_chanel_url_en: "https://t.me/crypto_serp",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
  {
    parsed_chanel_name: "₿ Криптовый поход ₿",
    parsed_chanel_url: "https://t.me/crypto_hike",
    my_chanel_url_ru: "https://t.me/cripto_maining",
    my_chanel_url_en: "https://t.me/crypto_serp",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
  {
    parsed_chanel_name: "Incrypted",
    parsed_chanel_url: "https://t.me/incrypted",
    my_chanel_url_ru: "https://t.me/cript_pulse",
    my_chanel_url_en: "https://t.me/cripto_pyls",
    post_count: standart_config_data.post_count,
    diff_hour: standart_config_data.diff_hour,
    system_ai_promt_ru: standart_config_data.system_ai_promt_ru,
    system_ai_promt_en: standart_config_data.system_ai_promt_en,
    ai_temperature: standart_config_data.ai_temperature,
    post_to_inst: true,
  },
];
