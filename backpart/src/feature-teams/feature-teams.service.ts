import { Injectable } from '@nestjs/common';
// import { CreateFeatureTeamDto } from './dto/create-feature-team.dto';
// import { UpdateFeatureTeamDto } from './dto/update-feature-team.dto';
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

  /* findOne(id: number) {
    return `This action returns a #${id} featureTeam`;
  }

  create(createFeatureTeamDto: CreateFeatureTeamDto) {
    return 'This action adds a new featureTeam';
  }

  update(id: number, updateFeatureTeamDto: UpdateFeatureTeamDto) {
    return `This action updates a #${id} featureTeam`;
  }

  remove(id: number) {
    return `This action removes a #${id} featureTeam`;
  } */
}
