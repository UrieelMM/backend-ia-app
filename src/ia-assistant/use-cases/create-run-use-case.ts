/* eslint-disable prettier/prettier */

import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId: string;
}

export const createRunCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  return run;
};
