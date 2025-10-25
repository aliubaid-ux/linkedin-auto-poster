'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating LinkedIn posts from a trending topic,
 * tailored to the user's specified niche and tone.
 *
 * - generateLinkedInPost - A function that generates a LinkedIn post.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define Zod schema for the input
const GenerateLinkedInPostInputSchema = z.object({
  topicSummary: z.string().describe('A summary of the trending topic.'),
  niche: z.string().describe('The user specified niche (e.g., AI, SEO, Web Design).'),
  tone: z.string().describe('The desired tone of the post (e.g., expert+conversational).'),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

// Define Zod schema for the output
const GenerateLinkedInPostOutputSchema = z.object({
  linkedinPost: z.string().describe('The generated LinkedIn post text.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

// Exported function to call the flow
export async function generateLinkedInPost(input: GenerateLinkedInPostInput): Promise<GenerateLinkedInPostOutput> {
  return generateLinkedInPostFlow(input);
}

// Define the prompt
const generateLinkedInPostPrompt = ai.definePrompt({
  name: 'generateLinkedInPostPrompt',
  input: {schema: GenerateLinkedInPostInputSchema},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are a concise LinkedIn content writer. 
Given this trending headline or summary:\n"{topicSummary}"\n\nWrite a LinkedIn post (80-160 words) targeting {niche}. \nTone: {tone}.\nInclude:\n- A one-line hook (strong first sentence).\n- Two short valuable insights the reader can act on.\n- A soft CTA question to drive comments.\nReturn in plain text.`,
});

// Define the flow
const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async input => {
    const {output} = await generateLinkedInPostPrompt(input);
    return output!;
  }
);
