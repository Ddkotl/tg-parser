import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
  baseURL: `http://localhost:${process.env.G4F_PORT}/v1`,
});
export const TEXT_AI_MODELS = [
  "gpt-4o",
  "gpt-4.1",
  "gpt-4",
  "gpt-4o-mini",
  "gpt-3.5-turbo",
];
