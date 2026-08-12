export type Player = {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	address: string;
	age: number;
	dob: Date;
	position: string;
	nbGoal: number;
	nbAssist: number;
	nbGame: number;
}

export type PlayersState = {
  players: Player[];
  loading: boolean;
  error: string | null;
}
