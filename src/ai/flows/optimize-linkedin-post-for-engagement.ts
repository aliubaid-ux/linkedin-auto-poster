'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing LinkedIn posts to maximize human tone and virality.
 *
 * - optimizeLinkedInPostForEngagement - An exported function that accepts a LinkedIn post draft and optimizes it for engagement.
 * - OptimizeLinkedInPostForEngagementInput - The input type for the optimizeLinkedInPostForEngagement function.
 * - OptimizeLinkedInPostForEngagementOutput - The return type for the optimizeLinkedInPostForEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeLinkedInPostForEngagementInputSchema = z.object({
  initialDraft: z.string().describe('The initial draft of the LinkedIn post to optimize.'),
});
export type OptimizeLinkedInPostForEngagementInput = z.infer<typeof OptimizeLinkedInPostForEngagementInputSchema>;

const OptimizeLinkedInPostForEngagementOutputSchema = z.object({
  optimizedText: z.string().describe('The optimized LinkedIn post text.'),
  optimizedMeta: z.object({
    hooks: z.array(z.string()).describe('A list of hooks used in the optimized post (e.g., question, stat).'),
    emotionalScore: z.number().describe('A score representing the emotional tone of the optimized post (0.0-1.0).'),
    engagementPrediction: z.number().describe('A predicted engagement score for the optimized post (0.0-1.0).'),
  }).optional(),
});
export type OptimizeLinkedInPostForEngagementOutput = z.infer<typeof OptimizeLinkedInPostForEngagementOutputSchema>;


export async function optimizeLinkedInPostForEngagement(input: OptimizeLinkedInPostForEngagementInput): Promise<OptimizeLinkedInPostForEngagementOutput> {
  return optimizeLinkedInPostForEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeLinkedInPostForEngagementPrompt',
  input: {schema: OptimizeLinkedInPostForEngagementInputSchema},
  output: {schema: OptimizeLinkedInPostForEngagementOutputSchema},
  prompt: `You are a LinkedIn growth strategist and copywriter.
Polish the following LinkedIn post to maximize human tone, storytelling, and virality while preserving facts.
Rules:
- Keep under 1200 characters.
- Add a short personal anecdote or micro-story if possible.
- Use 1–2 emojis, but sparingly.
- Include a question or 1-line CTA at the end.
- Keep it readable (avg. sentence length short).
Post to optimize:
{{{initialDraft}}}
Return a JSON object with the following structure:
{
  "optimizedText": "The optimized LinkedIn post text.",
  "optimizedMeta": {
    "hooks": ["A list of hooks used in the optimized post (e.g., question, stat)."],
    "emotionalScore": "A score representing the emotional tone of the optimized post (0.0-1.0).",
    "engagementPrediction": "A predicted engagement score for the optimized post (0.0-1.0)."
  }
}`,
});

const optimizeLinkedInPostForEngagementFlow = ai.defineFlow(
  {
    name: 'optimizeLinkedInPostForEngagementFlow',
    inputSchema: OptimizeLinkedInPostForEngagementInputSchema,
    outputSchema: OptimizeLinkedInPostForEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
