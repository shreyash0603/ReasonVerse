'use server';

/**
 * @fileOverview Summarizes user feedback on AI responses to identify common agreement/disagreement.
 *
 * - summarizeFeedback - A function that summarizes the feedback.
 * - SummarizeFeedbackInput - The input type for the summarizeFeedback function.
 * - SummarizeFeedbackOutput - The return type for the summarizeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFeedbackInputSchema = z.object({
  feedback1: z.string().describe('Feedback for the first AI response.'),
  feedback2: z.string().describe('Feedback for the second AI response.'),
});
export type SummarizeFeedbackInput = z.infer<typeof SummarizeFeedbackInputSchema>;

const SummarizeFeedbackOutputSchema = z.object({
  summary: z.string().describe('A summary of the common themes in the feedback.'),
});
export type SummarizeFeedbackOutput = z.infer<typeof SummarizeFeedbackOutputSchema>;

export async function summarizeFeedback(input: SummarizeFeedbackInput): Promise<SummarizeFeedbackOutput> {
  return summarizeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFeedbackPrompt',
  input: {schema: SummarizeFeedbackInputSchema},
  output: {schema: SummarizeFeedbackOutputSchema},
  prompt: `You are an AI assistant that summarizes user feedback on two different AI responses to a given query.

  Summarize the key agreements and disagreements between the following two pieces of feedback:

  Feedback 1: {{{feedback1}}}
  Feedback 2: {{{feedback2}}}

  Provide a concise summary of the overall sentiment and any recurring themes in the feedback.
  `,
});

const summarizeFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeFeedbackFlow',
    inputSchema: SummarizeFeedbackInputSchema,
    outputSchema: SummarizeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
