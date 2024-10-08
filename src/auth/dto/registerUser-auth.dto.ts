import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(12)
  password: string;

  @MinLength(1)
  @IsString()
  fullName: string;
}
