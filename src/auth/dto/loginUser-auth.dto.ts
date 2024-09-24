import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @MinLength(7)
  @MaxLength(12)
  @IsString()
  password: string;
}
