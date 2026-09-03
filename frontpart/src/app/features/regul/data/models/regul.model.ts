export const REGUL_MAX_TOTAL = 45;
export const REGUL_MAX_PIECES = 4;
export const REGUL_MIN_PIECE_AMOUNT = 1;

export type PieceRegul = {
  id: number;
  date: Date;
  amount: number;
};

export type Regul = {
  id: number;
  licence: string;
  items: PieceRegul[];
  total: number;
};

export type Regulations = Regul[];

export type CreateRegulRequest = {
  licence: string;
  amount: number;
};

export type UpdateRegulRequest = {
  licence: string;
};

export type AddRegulPieceRequest = {
  amount: number;
};
