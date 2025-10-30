'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Profile } from '@/lib/types';

const GenerateLinkedInPostInputSchema = z.object({
  topicSummary: z.string(),
  niche: z.string(),
  tone: z.string(),
});

const GenerateLinkedInPostOutputSchema = z.object({
  linkedinPost: z.string().describe('The generated LinkedIn post text.'),
});

const generateLinkedInPostPrompt = `You are a concise LinkedIn content writer. 
Given this trending headline or summary:\n"{topic}"\n\nWrite a LinkedIn post (80-160 words) targeting {niche}. \nTone: {tone}.\nInclude:\n- A one-line hook (strong first sentence).\n- Two short valuable insights the reader can act on.\n- A soft CTA question to drive comments.\nReturn in plain text.`;

export const generateLinkedInPost = ai.defineFlow(
  {
    name: 'generateLinkedInPost',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async ({ topicSummary, niche, tone }) => {

    const prompt = generateLinkedInPostPrompt
      .replace('{topic}', topicSummary)
      .replace('{niche}', niche)
      .replace('{tone}', tone);

    const { output } = await ai.generate({ prompt });
    const post = output as string;

    return {
      linkedinPost: post,
    };
  }
);
