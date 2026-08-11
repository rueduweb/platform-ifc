export type Game = {
  id: number;
  location: string;
  date: Date;
  gameNum: string;
  homeTeam: string;
  awayTeam: string;
  nbGoalHome: number;
  nbGoalAway: number;
  note: string;
  forfeit: boolean;
};

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


type SortDirection = 'asc' | 'desc';

export type GamesState = {
  games: Game[];

  loading: boolean;
  error: string | null;

  search: string;

  page: number;
  pageSize: number;

  sortColumn: keyof Game;
  sortDirection: SortDirection;
};
