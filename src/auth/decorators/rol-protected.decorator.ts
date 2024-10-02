import { SetMetadata } from '@nestjs/common';
import { Roles } from '../interfaces/rolesvalidate.interface';

export const META_ROLS = 'roles';

export const RolProtected = (...args: Roles[]) => {
  return SetMetadata(META_ROLS, args);
};
