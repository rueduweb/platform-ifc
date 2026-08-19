export type PieceRoute = {
  label: string;
  link: string;
};
export type PieceStats = {
  stat: string;
  val: number;
}

export type PieceData = {
  title: string;
  subtitle: string;

  graphic: string;
  color: string;

  num: number;
  all: number;

  stat1: PieceStats;
  stat2: PieceStats;
  stat3: PieceStats;

  routeLink1: PieceRoute;
  routeLink2: PieceRoute;
  routeLink3: PieceRoute;
};
