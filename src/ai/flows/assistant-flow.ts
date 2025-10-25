'use server';
/**
 * @fileOverview A general-purpose AI assistant flow.
 *
 * - chat - A function that handles the chat conversation.
 */

import {ai} from '@/ai/genkit';
import {MessageData} from 'genkit/generate';
import {z} from 'genkit';
import {toWav} from '@/lib/audio';

const ChatInputSchema = z.object({
  history: z.array(z.any()).describe('The chat history.'),
  prompt: z.string().describe("The user's message."),
});

const ChatOutputSchema = z.object({
  text: z.string().describe('The text response.'),
  audio: z.string().optional().describe('The audio response as a data URI.'),
});

export const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({history, prompt}) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      history: history as MessageData[],
      prompt: prompt,
    });

    const text = llmResponse.text;
    return {text};
  }
);

export const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async query => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Alloy'},
          },
        },
      },
      prompt: query,
    });
    if (!media?.url) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);
    return `data:audio/wav;base64,${wavBase64}`;
  }
);

export async function chat(
  history: MessageData[],
  prompt: string
): Promise<{text: string}> {
  // The history that comes from the client has a different format than the one expected by Genkit.
  // We need to convert it to the format that Genkit expects.
  const genkitHistory = history.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  return assistantFlow({history: genkitHistory, prompt});
}

export async function getAudioForText(text: string): Promise<string> {
  return textToSpeechFlow(text);
}