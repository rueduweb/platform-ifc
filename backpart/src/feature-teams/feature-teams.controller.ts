import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FeatureTeamsService } from './feature-teams.service';
import { UpdateFeatureTeamDto } from './dto/update-feature-team.dto';
// import { CreateFeatureTeamDto } from './dto/create-feature-team.dto';

@Controller('teams')
export class FeatureTeamsController {
  constructor(private readonly featureTeamsService: FeatureTeamsService) {}

  @Get()
  findAll() {
    return this.featureTeamsService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeatureTeamDto,
  ) {
    return this.featureTeamsService.update(id, dto);
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureTeamsService.findOne(+id);
  }

  @Post()
  create(@Body() createFeatureTeamDto: CreateFeatureTeamDto) {
    return this.featureTeamsService.create(createFeatureTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureTeamsService.remove(+id);
  } */
}
