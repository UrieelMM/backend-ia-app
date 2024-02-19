/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompletedStatusCase, createMessageCase, createRunCase, createThreadCase, getMessagesListCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';
import { ListMessagesDto } from './dtos/list-messages.dto';

@Injectable()
export class IaAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadCase(this.openai);
  }

  async userQuestion(question: QuestionDto) {
    await createMessageCase(this.openai, {
      threadId: question.threadId,
      question: question.question,
    });
    
    const run = await createRunCase(this.openai, {
      threadId: question.threadId,
      assistantId: question.assistantId,
    });

    await checkCompletedStatusCase(this.openai, {
      threadId: question.threadId,
      runId: run.id,
    });

    const messagesList = await getMessagesListCase(this.openai, {
      threadId: question.threadId,
    });

    return messagesList;
  }

  async getMessagesList(threadId: ListMessagesDto) {
    const messagesList = await getMessagesListCase(this.openai, {
      threadId: threadId.threadId,
    });
    return messagesList;
  }
}
