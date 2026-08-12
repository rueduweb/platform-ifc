export type GameDto = {
  id: number;
  location: string;
  date: string;
  gameNum: string;
  homeTeam: string;
  awayTeam: string;
  nbGoalHome: number;
  nbGoalAway: number;
  note: string;
  forfeit: boolean;
};
