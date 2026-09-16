import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';

import { CreateRegulDto } from './dto/create-regul.dto';
import { RegulsService } from './reguls.service';
import { AddRegulPieceDto } from './dto/add-regul-piece.dto';
import { UpdateRegulPieceDto } from './dto/update-regul-piece.dto';

@Controller('reguls')
export class RegulsController {
  constructor(private readonly regulsService: RegulsService) {}

  @Post()
  create(@Body() createRegulDto: CreateRegulDto) {
    return this.regulsService.create(createRegulDto);
  }

  @Get()
  findAll() {
    return this.regulsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.regulsService.findOne(id);
  }

  @Post(':regulId/pieces')
  addPiece(
    @Param('regulId', ParseIntPipe) regulId: number,
    @Body() dto: AddRegulPieceDto,
  ) {
    return this.regulsService.addPiece(regulId, dto);
  }

  @Patch(':regulId/pieces/:pieceId')
  updatePiece(
    @Param('regulId', ParseIntPipe) regulId: number,
    @Param('pieceId', ParseIntPipe) pieceId: number,
    @Body() dto: UpdateRegulPieceDto,
  ) {
    return this.regulsService.updatePiece(regulId, pieceId, dto);
  }

  @Delete(':regulId/pieces/:pieceId')
  deletePiece(
    @Param('regulId', ParseIntPipe) regulId: number,
    @Param('pieceId', ParseIntPipe) pieceId: number,
  ) {
    return this.regulsService.deletePiece(regulId, pieceId);
  }
}
