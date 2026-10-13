import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeatureTeamsService } from './feature-teams.service';
// import { CreateFeatureTeamDto } from './dto/create-feature-team.dto';
// import { UpdateFeatureTeamDto } from './dto/update-feature-team.dto';

@Controller('teams')
export class FeatureTeamsController {
  constructor(private readonly featureTeamsService: FeatureTeamsService) {}

  @Get()
  findAll() {
    return this.featureTeamsService.findAll();
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureTeamsService.findOne(+id);
  }

  @Post()
  create(@Body() createFeatureTeamDto: CreateFeatureTeamDto) {
    return this.featureTeamsService.create(createFeatureTeamDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeatureTeamDto: UpdateFeatureTeamDto,
  ) {
    return this.featureTeamsService.update(+id, updateFeatureTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureTeamsService.remove(+id);
  } */
}
