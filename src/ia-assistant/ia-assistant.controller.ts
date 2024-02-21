/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { IaAssistantService } from './ia-assistant.service';
import { QuestionDto } from './dtos/question.dto';
import { ListMessagesDto } from './dtos/list-messages.dto';

@Controller('api/ia-assistant')
export class IaAssistantController {
  constructor(private readonly iaAssistantService: IaAssistantService) {
  }

  @Post('create-thread')
  async createThread(){
    return await this.iaAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(
    @Body() questionDto: QuestionDto
  ){
    return await this.iaAssistantService.userQuestion(questionDto);
  }

  @Post('list-messages')
  async listMessages(
    @Body() listMessagesDto: ListMessagesDto
  ){
    return await this.iaAssistantService.getMessagesList(listMessagesDto);
  }
}
