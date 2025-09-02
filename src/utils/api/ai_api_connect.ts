import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
  baseURL: `http://localhost:${process.env.G4F_PORT}/v1`,
});
