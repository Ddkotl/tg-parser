import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
  baseURL: `http://localhost:${process.env.G4F_PORT}/v1`,
});
export const TEXT_AI_MODELS = ["deepseek-v3","deepseek-v3.1","llama","gpt-4"];
