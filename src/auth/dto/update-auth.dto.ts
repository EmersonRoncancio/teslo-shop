import { PartialType } from '@nestjs/mapped-types';
import { RegisterUser } from './registerUser-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterUser) {}
