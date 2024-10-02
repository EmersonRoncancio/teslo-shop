import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../interfaces/rolesvalidate.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolProtected } from './rol-protected.decorator';
import { UsersRolesGuard } from '../guards/users-roles.guard';

export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RolProtected(...roles),
    UseGuards(AuthGuard(), UsersRolesGuard),
  );
}
