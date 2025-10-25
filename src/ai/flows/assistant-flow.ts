'use server';
/**
 * @fileOverview A general-purpose AI assistant flow.
 *
 * - chat - A function that handles the chat conversation.
 */

import {ai} from '@/ai/genkit';
import {MessageData} from 'genkit/generate';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.any()).describe('The chat history.'),
  prompt: z.string().describe("The user's message."),
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
  // The history that comes from the client has a different format than the one expected by Genkit.
  // We need to convert it to the format that Genkit expects.
  const genkitHistory = history.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  return assistantFlow({history: genkitHistory, prompt});
}
