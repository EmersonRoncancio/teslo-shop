import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role: string[] = this.reflector.get('roles', context.getHandler());
    console.log(role);
    if (!role) throw new UnauthorizedException();

    const req = context.switchToHttp().getRequest();
    const validateRol: User = req.user;

    if (
      role.includes(validateRol.roles[0]) &&
      validateRol.roles[0] === 'user'
    ) {
      console.log('sos admin');
      throw new UnauthorizedException();
    }

    return true;
  }
}
