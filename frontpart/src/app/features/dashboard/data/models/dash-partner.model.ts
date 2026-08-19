import { PieceRoute } from "./piece-data.model";

export type PartnerLogo = {
  name: string;
  src: string;
  alt?: string;
};

export type PartnerStat = {
  name: string;
  nb: number;
};

export type DashPartners = {
  title: string;
  color: string;

  routeLinks: PieceRoute[];

  logos: PartnerLogo[];

  total: number;

  stats: PartnerStat[];
};
