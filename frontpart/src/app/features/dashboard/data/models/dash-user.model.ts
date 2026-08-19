import { PieceRoute, PieceStats } from "./piece-data.model";

export type UsersType = {
	user: number;
	author: number;
	admin: number;
}

export type DashUsers = {
	title: string;
	color: string;
	all: number;
  num: number;
  subtitle: string;
	connected: UsersType;
	routeLinks: PieceRoute[];
	stats: PieceStats[];
}
