import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class FeatureTeamService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retourne toutes les équipes
   * dans l'ordre du classement.
   */
  async findAll() {
    return this.prisma.team.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(
        `L'équipe avec l'identifiant ${id} n'existe pas.`,
      );
    }

    return team;
  }

  /**
   * Crée une équipe.
   */
  async create(createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({
      data: createTeamDto,
    });
  }

  /**
   * Modifie une équipe.
   */
  async update(id: number, updateTeamDto: UpdateTeamDto) {
    await this.findOne(id);

    return this.prisma.team.update({
      where: {
        id,
      },
      data: updateTeamDto,
    });
  }

  /**
   * Supprime une équipe.
   */
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.team.delete({
      where: {
        id,
      },
    });
  }
}
