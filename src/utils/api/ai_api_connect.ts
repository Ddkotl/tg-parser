import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
  baseURL: `http://localhost:${process.env.G4F_PORT}/v1`,
  timeout: 30000,
});

export const TEXT_AI_MODELS = ["gpt-4","deepseek-r1-distill-llama-70b",
"deepseek-v3-0324-turbo",
"deepseek-prover-v2-671b",
"deepseek-v3-0324",
"deepseek-r1-turbo",
"deepseek-r1-0528-turbo",
"deepseek-r1-0528 (text)llama-3.2-90b",
"phi-4-reasoning-plus",
"llama-4-scout",
"phi-4",
"llama-3.3-70b","gpt4o",
"gpt45",
"gemini-search",
"deepseek-v3",
"openai",
"mistral-small-3.1-24b",
"gemini-2.5-flash-lite"];
