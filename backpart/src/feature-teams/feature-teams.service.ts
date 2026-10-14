import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { UpdateFeatureTeamDto } from './dto/update-feature-team.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.team.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }

  async update(id: number, dto: UpdateFeatureTeamDto) {
    const hasChanges = Object.values(dto).some((value) => value !== undefined);

    if (!hasChanges) {
      throw new BadRequestException('Au moins un champ doit être fourni.');
    }

    try {
      return await this.prisma.team.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Aucune équipe trouvée avec l'identifiant ${id}.`,
        );
      }

      throw error;
    }
  }

  /* findOne(id: number) {
    return `This action returns a #${id} featureTeam`;
  }

  create(createFeatureTeamDto: CreateFeatureTeamDto) {
    return 'This action adds a new featureTeam';
  }

  remove(id: number) {
    return `This action removes a #${id} featureTeam`;
  } */
}
