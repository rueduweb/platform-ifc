import { SetMetadata } from '@nestjs/common';

export const Userapp = (...args: string[]) => SetMetadata('userapp', args);
