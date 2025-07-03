'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing and displaying two AI-generated responses side-by-side.
 *
 * - analyzeAndDisplayAiResponses - A function that orchestrates the analysis and display of AI responses.
 * - AnalyzeAndDisplayAiResponsesInput - The input type for the analyzeAndDisplayAiResponses function.
 * - AnalyzeAndDisplayAiResponsesOutput - The return type for the analyzeAndDisplayAiResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAndDisplayAiResponsesInputSchema = z.object({
  response1: z.string().describe('The first AI-generated response.'),
  response2: z.string().describe('The second AI-generated response.'),
});
export type AnalyzeAndDisplayAiResponsesInput = z.infer<typeof AnalyzeAndDisplayAiResponsesInputSchema>;

const AnalyzeAndDisplayAiResponsesOutputSchema = z.object({
  analysis: z.string().describe('A comparative analysis of the two AI responses, highlighting reasoning and sources.'),
});
export type AnalyzeAndDisplayAiResponsesOutput = z.infer<typeof AnalyzeAndDisplayAiResponsesOutputSchema>;

export async function analyzeAndDisplayAiResponses(input: AnalyzeAndDisplayAiResponsesInput): Promise<AnalyzeAndDisplayAiResponsesOutput> {
  return analyzeAndDisplayAiResponsesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAndDisplayAiResponsesPrompt',
  input: {schema: AnalyzeAndDisplayAiResponsesInputSchema},
  output: {schema: AnalyzeAndDisplayAiResponsesOutputSchema},
  prompt: `You are an expert analyst tasked with comparing and contrasting two AI-generated responses. Your analysis should highlight the reasoning used by each AI, the sources they relied on, and any potential biases or limitations.

Response 1: {{{response1}}}

Response 2: {{{response2}}}

Provide a detailed comparative analysis, focusing on the strengths and weaknesses of each response. Conclude with which response is more valid, based on your expertise.
`,
});

const analyzeAndDisplayAiResponsesFlow = ai.defineFlow(
  {
    name: 'analyzeAndDisplayAiResponsesFlow',
    inputSchema: AnalyzeAndDisplayAiResponsesInputSchema,
    outputSchema: AnalyzeAndDisplayAiResponsesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
