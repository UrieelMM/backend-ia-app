/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { IaAssistantModule } from './ia-assistant/ia-assistant.module';

@Module({
  imports: [
    GptModule,
    ConfigModule.forRoot(),
    IaAssistantModule
  ]
})
export class AppModule {}
