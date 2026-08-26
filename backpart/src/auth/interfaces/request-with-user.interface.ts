import { Request } from 'express';
import { Role } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    role: Role;
  };
}
