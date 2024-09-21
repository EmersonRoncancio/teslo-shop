import {
  IsBoolean,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUser {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(12)
  password: string;

  @IsString()
  fullName: string;

  @IsBoolean()
  isActive: boolean;

  //   @IsString({ each: true })
  //   @IsArray()
  //   roles: string[];
}
