import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './../database/database.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.databaseService.player.create({
      data: createPlayerDto,
    });
  }

  async findAll(): Promise<Player[]> {
    return await this.databaseService.player.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Player | null> {
    const player = await this.databaseService.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found.');
    }
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.databaseService.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found.');
    }
    return this.databaseService.player.update({
      where: {
        id,
      },
      data: updatePlayerDto,
    });
  }

  async remove(id: number): Promise<Player> {
    const player = await this.databaseService.player.findUnique({
      where: { id },
    });
    if (!player) {
      throw new NotFoundException('Player not found.');
    }
    return await this.databaseService.player.delete({
      where: { id },
    });
  }
}
