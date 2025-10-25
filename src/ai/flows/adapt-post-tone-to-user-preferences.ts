/** @fileOverview This file contains a Genkit flow that adapts the tone of a generated LinkedIn post to match the user's learned tone profile.
 *
 * - adaptPostToneToUserPreferences - Adjusts the post to match the user's learned tone.
 * - AdaptPostToneToUserPreferencesInput - The input type for the adaptPostToneToUserPreferences function.
 * - AdaptPostToneToUserPreferencesOutput - The return type for the adaptPostToneToUserPreferences function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AdaptPostToneToUserPreferencesInputSchema = z.object({
  post: z.string().describe('The LinkedIn post to adapt.'),
  learnedToneJson: z.string().describe('The JSON representation of the user\'s learned tone profile.'),
});

export type AdaptPostToneToUserPreferencesInput = z.infer<
  typeof AdaptPostToneToUserPreferencesInputSchema
>;

const AdaptPostToneToUserPreferencesOutputSchema = z.object({
  finalPost: z.string().describe('The adapted LinkedIn post.'),
  score: z
    .number()
    .min(0)
    .max(1)
    .describe('A score indicating how well the post matches the learned tone (0.0-1.0).'),
  adjustments: z.array(z.string()).describe('A list of adjustments made to the post.'),
});

export type AdaptPostToneToUserPreferencesOutput = z.infer<
  typeof AdaptPostToneToUserPreferencesOutputSchema
>;

export async function adaptPostToneToUserPreferences(
  input: AdaptPostToneToUserPreferencesInput
): Promise<AdaptPostToneToUserPreferencesOutput> {
  return adaptPostToneToUserPreferencesFlow(input);
}

const adaptPostToneToUserPreferencesPrompt = ai.definePrompt({
  name: 'adaptPostToneToUserPreferencesPrompt',
  input: {schema: AdaptPostToneToUserPreferencesInputSchema},
  output: {schema: AdaptPostToneToUserPreferencesOutputSchema},
  prompt: `Analyze the improved post vs. my learned tone profile:
{{{learnedToneJson}}}
If the post deviates, adjust word choice/length to match learned tone. 
Return final post and an object: {score: 0.0-1.0, adjustments: [...]}`,
});

const adaptPostToneToUserPreferencesFlow = ai.defineFlow(
  {
    name: 'adaptPostToneToUserPreferencesFlow',
    inputSchema: AdaptPostToneToUserPreferencesInputSchema,
    outputSchema: AdaptPostToneToUserPreferencesOutputSchema,
  },
  async input => {
    const {output} = await adaptPostToneToUserPreferencesPrompt(input);
    return output!;
  }
);
