import { IsString, MinLength } from 'class-validator';

export class MessageClientDTO {
  @IsString()
  @MinLength(1)
  message: string;
}
