import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatureTeamDto } from './create-feature-team.dto';

export class UpdateFeatureTeamDto extends PartialType(CreateFeatureTeamDto) {}
