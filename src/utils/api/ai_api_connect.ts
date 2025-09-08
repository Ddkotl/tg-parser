import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
  baseURL: `http://localhost:${process.env.G4F_PORT}/v1`,
});
export const TEXT_AI_MODELS = [
  "gpt-5",
  "deepseek-v3",
  "gpt-4.5",
  "gpt-4o",
  "gpt-4",
  "gpt-4o-mini",
  "deepseek-r1",
  "o4",
  "o3",
  "o1",
];