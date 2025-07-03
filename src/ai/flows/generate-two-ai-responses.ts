'use server';
/**
 * @fileOverview Generates two distinct AI-powered responses to a complex query using different LLMs.
 *
 * - generateTwoAiResponses - A function that handles the generation of two AI responses.
 * - GenerateTwoAiResponsesInput - The input type for the generateTwoAiResponses function.
 * - GenerateTwoAiResponsesOutput - The return type for the generateTwoAiResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTwoAiResponsesInputSchema = z.object({
  query: z.string().describe('The complex query to generate responses for.'),
});
export type GenerateTwoAiResponsesInput = z.infer<typeof GenerateTwoAiResponsesInputSchema>;

const GenerateTwoAiResponsesOutputSchema = z.object({
  response1: z.string().describe('The first AI-powered response.'),
  response2: z.string().describe('The second AI-powered response.'),
});
export type GenerateTwoAiResponsesOutput = z.infer<typeof GenerateTwoAiResponsesOutputSchema>;

export async function generateTwoAiResponses(input: GenerateTwoAiResponsesInput): Promise<GenerateTwoAiResponsesOutput> {
  return generateTwoAiResponsesFlow(input);
}

const prompt1 = ai.definePrompt({
  name: 'generateAiResponse1Prompt',
  input: {schema: GenerateTwoAiResponsesInputSchema},
  prompt: `You are an AI assistant. Please provide a detailed and well-reasoned answer to the following query: {{{query}}}`,
});

const prompt2 = ai.definePrompt({
  name: 'generateAiResponse2Prompt',
  input: {schema: GenerateTwoAiResponsesInputSchema},
  prompt: `You are an AI assistant. Please provide a detailed and well-reasoned answer to the following query: {{{query}}}`,
  model: 'models/gemini-1.5-pro-latest',
});


const generateTwoAiResponsesFlow = ai.defineFlow(
  {
    name: 'generateTwoAiResponsesFlow',
    inputSchema: GenerateTwoAiResponsesInputSchema,
    outputSchema: GenerateTwoAiResponsesOutputSchema,
  },
  async input => {
    // Concurrently generate two responses using different prompts/models.
    const [response1Result, response2Result] = await Promise.all([
      prompt1(input),
      prompt2(input),
    ]);

    return {
      response1: response1Result.output!.text,
      response2: response2Result.output!.text,
    };
  }
);
