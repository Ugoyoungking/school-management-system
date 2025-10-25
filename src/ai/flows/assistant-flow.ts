'use server';
/**
 * @fileOverview A general-purpose AI assistant flow.
 *
 * - chat - A function that handles the chat conversation.
 */

import {ai} from '@/ai/genkit';
import {generate, MessageData} from 'genkit/generate';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.any()).describe('The chat history.'),
  prompt: z.string().describe('The user\'s message.'),
});

export const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({history, prompt}) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      history: history as MessageData[],
      prompt: prompt,
    });

    return llmResponse.text;
  }
);

export async function chat(history: MessageData[], prompt: string): Promise<string> {
  return assistantFlow({history, prompt});
}
