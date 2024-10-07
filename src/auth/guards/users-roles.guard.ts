import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLS } from '../decorators/rol-protected.decorator';

@Injectable()
export class UsersRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role: string[] = this.reflector.get(META_ROLS, context.getHandler());
    if (!role) throw new InternalServerErrorException();

    const req = context.switchToHttp().getRequest();
    const validateRol: User = req.user;
    if (!validateRol) throw new BadRequestException();

    // if (
    //   role.includes(validateRol.roles[0]) &&
    //   validateRol.roles[0] === 'admin'
    // ) {
    //   return true;
    // } else {
    //   throw new UnauthorizedException();
    // }

    if (role.includes(validateRol.roles[0])) return true;

    throw new UnauthorizedException();
  }
}
