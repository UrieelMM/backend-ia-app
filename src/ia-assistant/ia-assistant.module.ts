/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { IaAssistantService } from './ia-assistant.service';
import { IaAssistantController } from './ia-assistant.controller';

@Module({
  controllers: [IaAssistantController],
  providers: [IaAssistantService],
})
export class IaAssistantModule {}
