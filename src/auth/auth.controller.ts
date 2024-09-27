import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser-auth.dto';
import { LoginUserDto } from './dto/loginUser-auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registeruser: RegisterUserDto) {
    return this.authService.registerUsers(registeruser);
  }

  @Post('login')
  loginUser(@Body() loginuser: LoginUserDto) {
    return this.authService.loginUsers(loginuser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getPerfil(@Request() req: any) {
    return req.user;
  }
}
