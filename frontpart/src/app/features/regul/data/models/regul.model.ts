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
  license: string;
  items: PieceRegul[];
  total: number;
};

export type Regulations = Regul[];

export type CreateRegulRequest = {
  license: string;
  amount?: number;
};

export type UpdateRegulRequest = {
  license: string;
};

export type AddRegulPieceRequest = {
  amount: number;
};

export type UpdateRegulPieceRequest = {
  amount: number;
};

