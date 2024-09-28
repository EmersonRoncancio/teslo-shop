import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser-auth.dto';
import { LoginUserDto } from './dto/loginUser-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/getUser.decorator';
import { User } from './entities/user.entity';

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

  @UseGuards(AuthGuard())
  @Get('perfil')
  getPerfil(@GetUser() user: User) {
    return user;
  }
}
