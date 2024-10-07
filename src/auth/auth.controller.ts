import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser-auth.dto';
import { LoginUserDto } from './dto/loginUser-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/getUser.decorator';
import { User } from './entities/user.entity';
import { UsersRolesGuard } from './guards/users-roles.guard';
import { RolProtected } from './decorators/rol-protected.decorator';
import { Roles } from './interfaces/rolesvalidate.interface';
import { Auth } from './decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auntenticacion')
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

  @Get('roles')
  @RolProtected(Roles.admin)
  @UseGuards(AuthGuard(), UsersRolesGuard)
  getUserRoles(@GetUser() user: User) {
    return user;
  }

  @Get('roles2')
  @Auth(Roles.admin)
  getUserRoles2(@GetUser() user: User) {
    return user;
  }

  @Get('checkAuth')
  @Auth(Roles.admin, Roles.user)
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.CheckAuthStatus(user.id);
  }
}
