"use server";

import { chat, getAudioForText } from "@/ai/flows/assistant-flow";
import { MessageData } from "genkit/generate";

export async function getChatResponse(history: MessageData[], prompt: string) {
  try {
    const response = await chat(history, prompt);
    return { success: true, message: response.text };
  } catch (error) {
    console.error("Chatbot error:", error);
    return { success: false, error: "The AI assistant is currently unavailable. Please try again later." };
  }
}

export async function getTextToSpeech(text: string) {
    try {
        const audioDataUri = await getAudioForText(text);
        return { success: true, audioData: audioDataUri };
    } catch (error) {
        console.error("Text-to-speech error:", error);
        return { success: false, error: "Could not generate audio." };
    }
}
