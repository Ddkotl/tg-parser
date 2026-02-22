import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
  baseURL: `http://localhost:${process.env.G4F_PORT}/v1`,
  timeout: 30000,
});

export const TEXT_AI_MODELS = [
   "gpt4",
  "openai",
  "llama-4-scout",
  // "openai-large",
  // "models/gemma-3-27b-it",
  // "anthropic:anthropic/claude-sonnet-4-6",
    // "deepseek:deepseek/deepseek-chat",
  // "deepseek-r1-distill-llama-70b",
  // "deepseek-v3-0324-turbo",
  // "deepseek-prover-v2-671b",
  // "deepseek-v3-0324",
  // "deepseek-r1-turbo",
  // "deepseek-r1-0528-turbo",
  // "deepseek-r1-0528 (text)llama-3.2-90b",
  // "phi-4-reasoning-plus",
  
  // "phi-4",
  // "llama-3.3-70b",
  // "gpt4o",
  // "gpt4",
  // "gpt5",
  // "gpt45",
  // "gemini-search",
  // "deepseek-v3",
  // "mistral-small-3.1-24b",
  // "gemini-2.5-flash-lite",
  // "gpt-4",
];
