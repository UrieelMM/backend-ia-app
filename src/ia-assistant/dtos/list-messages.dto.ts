/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";

export class ListMessagesDto {
  @IsString()
  readonly threadId: string;
}