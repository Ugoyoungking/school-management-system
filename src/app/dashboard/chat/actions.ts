"use server";

import { chat } from "@/ai/flows/assistant-flow";
import { MessageData } from "genkit/generate";

export async function getChatResponse(history: MessageData[], prompt: string) {
  try {
    const response = await chat(history, prompt);
    return { success: true, message: response };
  } catch (error) {
    console.error("Chatbot error:", error);
    return { success: false, error: "The AI assistant is currently unavailable. Please try again later." };
  }
}
