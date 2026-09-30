import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { FeatureTeamService } from './feature-team.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class FeatureTeamController {
  constructor(private readonly featureTeamService: FeatureTeamService) {}

  /**
   * GET /teams
   */
  @Get()
  findAll() {
    return this.featureTeamService.findAll();
  }

  /**
   * GET /teams/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureTeamService.findOne(+id);
  }

  /**
   * POST /teams
   */
  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.featureTeamService.create(createTeamDto);
  }

  /**
   * PATCH /teams/:id
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.featureTeamService.update(id, updateTeamDto);
  }

  /**
   * DELETE /teams/:id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.featureTeamService.remove(id);
  }
}
