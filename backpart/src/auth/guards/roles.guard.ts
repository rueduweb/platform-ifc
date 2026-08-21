import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';

type AuthenticatedRequest = Request & {
  user: {
    role: Role;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('🔥 RolesGuard EXECUTED');
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('REQUIRED ROLES:', requiredRoles);

    // Aucun rôle spécifié sur l'endpoint
    if (!requiredRoles) {
      console.log('⚠️ Aucun rôle requis');
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: Role } }>();

    const user = request.user;

    console.log('REQUEST USER:', user);
    console.log('USER ROLE:', user?.role);

    if (!user) {
      throw new ForbiddenException('Accès refusé.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès refusé.');
    }
    console.log('✅ ROLE ACCEPTED');
    return true;
  }
}
