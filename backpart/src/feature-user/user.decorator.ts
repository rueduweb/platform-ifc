import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Userapp = (...args: string[]) => SetMetadata('userapp', args);
