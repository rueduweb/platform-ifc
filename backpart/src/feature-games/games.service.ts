import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    return await this.databaseService.game.create({
      data: createGameDto,
    });
  }

  async findAll(): Promise<Game[]> {
    return await this.databaseService.game.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Game | null> {
    const game = await this.databaseService.game.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found.');
    }
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.databaseService.game.findUnique({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found.');
    }
    return this.databaseService.game.update({
      where: {
        id,
      },
      data: updateGameDto,
    });
  }

  async remove(id: number): Promise<Game> {
    const game = await this.databaseService.game.findUnique({
      where: { id },
    });
    if (!game) {
      throw new NotFoundException('Game not found.');
    }
    return await this.databaseService.game.delete({
      where: { id },
    });
  }
}
