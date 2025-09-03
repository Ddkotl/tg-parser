export type ParseChanelConfigData = {
  parsed_chanel_url: string;
  my_chanel_url_ru: string;
  my_chanel_url_en: string;
  post_count: number;
  diff_hour: number;
};
export const chanels_parser_config: ParseChanelConfigData[] = [
  {
    parsed_chanel_url: "https://t.me/Goroskop",
    my_chanel_url_ru: "https://t.me/star_eliksir",
    my_chanel_url_en: "https://t.me/star_elixir",
    post_count: 5,
    diff_hour: 3,
  },
];
