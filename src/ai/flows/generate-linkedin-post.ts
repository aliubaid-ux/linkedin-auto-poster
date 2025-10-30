'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Profile } from '@/lib/types';

// Define Zod schema for the input
const GenerateLinkedInPostInputSchema = z.object({
  topic: z.string(),
  context: z.string().optional(),
  profile: z.custom<Profile>()
});

// Define Zod schema for the output
const GenerateLinkedInPostOutputSchema = z.object({
  raw_generation: z.string().describe('The generated LinkedIn post text.'),
  optimized_text: z.string(),
  optimized_meta: z.object({
    hooks: z.array(z.string()),
    emotional_score: z.number(),
    engagement_prediction: z.number(),
    tone_score: z.number(),
    tone_adjustments: z.array(z.string()),
  })
});

// Define the prompt
const generateLinkedInPostPrompt = `You are a concise LinkedIn content writer. 
Given this trending headline or summary:\n"{topic}"\n\nWrite a LinkedIn post (80-160 words) targeting {niche}. \nTone: {tone}.\nInclude:\n- A one-line hook (strong first sentence).\n- Two short valuable insights the reader can act on.\n- A soft CTA question to drive comments.\nReturn in plain text.`;

// Define the flow
export const generatePostFlow = ai.defineFlow(
  {
    name: 'generatePostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async ({ topic, context, profile }) => {
    const niche = profile.niches.join(', ') || 'general professional';
    const tone = profile.tone;

    const prompt = generateLinkedInPostPrompt
      .replace('{topic}', topic)
      .replace('{niche}', niche)
      .replace('{tone}', tone);

    const { output } = await ai.generate({ prompt });
    const post = output as string;

    // For now, we'll just return the same content for raw and optimized
    // and use placeholder values for the meta data.
    return {
      raw_generation: post,
      optimized_text: post,
      optimized_meta: {
        hooks: [],
        emotional_score: 0.5,
        engagement_prediction: 0.5,
        tone_score: 0.5,
        tone_adjustments: []
      }
    };
  }
);
