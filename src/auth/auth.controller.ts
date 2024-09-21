import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUser } from './dto/registerUser-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registeruser: RegisterUser) {
    return this.authService.registerUsers(registeruser);
  }
}
