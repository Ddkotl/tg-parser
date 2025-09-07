import type { TelegramClient } from "telegram";

export type SupportedLang = "ru-RU" | "en-US";

export type ParseChanelConfigData = {
  parsed_chanel_url: string;
  my_chanel_url_ru: string;
  my_chanel_url_en: string;
  post_count: number;
  diff_hour: number;
  system_ai_promt_ru: string;
  system_ai_promt_en: string;
  ai_temperature: number;
  post_to_inst: boolean;
};

export type ParseChanelData = {
  client: TelegramClient;
  config: ParseChanelConfigData;
};
