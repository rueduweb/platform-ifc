import { Team } from './team.model';

export type RankedTeam = Team & {
  rank?: number;
  pts: number;
  avg: number;
};
