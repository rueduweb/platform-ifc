import { Module } from '@nestjs/common';
import { RegulsService } from './reguls.service';
import { RegulsController } from './reguls.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [RegulsController],
  providers: [RegulsService, PrismaService],
})
export class RegulsModule {}
