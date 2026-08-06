import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    return await this.databaseService.partner.create({
      data: createPartnerDto,
    });
  }

  async findAll(): Promise<Partner[]> {
    return await this.databaseService.partner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Partner | null> {
    const partner = await this.databaseService.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found.');
    }
    return partner;
  }

  async update(
    id: number,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    const partner = await this.databaseService.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found.');
    }
    return this.databaseService.partner.update({
      where: {
        id,
      },
      data: updatePartnerDto,
    });
  }

  async remove(id: number): Promise<Partner> {
    const partner = await this.databaseService.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException('Partner not found.');
    }
    return await this.databaseService.partner.delete({
      where: { id },
    });
  }
}
