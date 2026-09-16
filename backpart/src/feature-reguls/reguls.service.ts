import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { CreateRegulDto } from './dto/create-regul.dto';
import { AddRegulPieceDto } from './dto/add-regul-piece.dto';
import { UpdateRegulPieceDto } from './dto/update-regul-piece.dto';
import { PieceRegul } from './types/piece-regul.type';

export type RegulResponse = {
  id: number;
  license: string;
  items: PieceRegul[];
  total: number;
};

@Injectable()
export class RegulsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegulDto) {
    const items =
      dto.amount === undefined
        ? []
        : [
            {
              id: 1,
              date: new Date(),
              amount: dto.amount,
            },
          ];

    const total = dto.amount ?? 0;

    return this.prisma.regul.create({
      data: {
        license: dto.license,
        items,
        total,
      },
    });
  }

  async findAll() {
    return this.prisma.regul.findMany();
  }

  async findOne(id: number) {
    const regul = await this.prisma.regul.findUnique({
      where: {
        id,
      },
    });

    if (!regul) {
      throw new NotFoundException(`Regul ${id} not found`);
    }

    return regul;
  }

  async addPiece(regulId: number, dto: AddRegulPieceDto) {
    const regul = await this.findOne(regulId);

    const items = this.parsePieces(regul.items);

    if (items.length >= 4) {
      throw new BadRequestException(
        'A regul cannot contain more than 4 pieces',
      );
    }

    const total = regul.total + dto.amount;

    if (total > 45) {
      throw new BadRequestException('Regul total cannot exceed 45');
    }

    const piece: PieceRegul = {
      id: items.length + 1,
      date: new Date(),
      amount: dto.amount,
    };

    const newItems = [...items, piece];

    return this.prisma.regul.update({
      where: {
        id: regulId,
      },
      data: {
        items: this.serializePieces(newItems),
        total,
      },
    });
  }

  async updatePiece(
    regulId: number,
    pieceId: number,
    dto: UpdateRegulPieceDto,
  ) {
    const regul = await this.findOne(regulId);

    const items = this.parsePieces(regul.items);

    if (items.length >= 4) {
      throw new BadRequestException(
        'A regul cannot contain more than 4 pieces',
      );
    }

    const piece = items.find((item) => item.id === pieceId);

    if (!piece) {
      throw new NotFoundException(
        `Piece ${pieceId} not found in regul ${regulId}`,
      );
    }

    const newTotal = regul.total - piece.amount + dto.amount;

    if (newTotal > 45) {
      throw new BadRequestException('Regul total cannot exceed 45');
    }

    const updatedItems = items.map((item) => {
      if (item.id === pieceId) {
        return {
          ...item,
          amount: dto.amount,
          date: new Date(),
        };
      }

      return item;
    });

    let total = 0;

    for (const item of updatedItems) {
      total += item.amount;
    }

    return this.prisma.regul.update({
      where: {
        id: regulId,
      },
      data: {
        items: this.serializePieces(updatedItems),
        total,
      },
    });
  }

  async deletePiece(regulId: number, pieceId: number) {
    const regul = await this.findOne(regulId);

    const items = this.parsePieces(regul.items);

    const piece = items.find((item) => item.id === pieceId);

    if (!piece) {
      throw new NotFoundException(
        `Piece ${pieceId} not found in regul ${regulId}`,
      );
    }
    const updatedItems = items.filter((item) => item.id !== pieceId);
    let newTotal = 0;

    for (const item of updatedItems) {
      const amount: number = item.amount;
      newTotal = newTotal + amount;
    }
    return this.prisma.regul.update({
      where: {
        id: regulId,
      },
      data: {
        items: this.serializePieces(updatedItems),
        total: newTotal,
      },
    });
  }

  // Conversion Methods
  private parsePieces(items: Prisma.JsonValue): PieceRegul[] {
    if (!Array.isArray(items)) {
      throw new BadRequestException('Invalid regul items format');
    }

    return items.map((item): PieceRegul => {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        throw new BadRequestException('Invalid regul piece format');
      }

      if (!('id' in item) || !('amount' in item) || !('date' in item)) {
        throw new BadRequestException('Invalid regul piece format');
      }

      if (
        typeof item.id !== 'number' ||
        typeof item.amount !== 'number' ||
        typeof item.date !== 'string'
      ) {
        throw new BadRequestException('Invalid regul piece format');
      }

      const date = new Date(item.date);

      if (Number.isNaN(date.getTime())) {
        throw new BadRequestException('Invalid regul piece date');
      }

      return {
        id: item.id,
        amount: item.amount,
        date,
      };
    });
  }

  private serializePieces(pieces: PieceRegul[]) {
    return pieces.map((piece) => ({
      id: piece.id,
      amount: piece.amount,
      date: piece.date.toISOString(),
    }));
  }
}
