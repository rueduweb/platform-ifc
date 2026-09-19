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
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRegulDto = {
  license: string;
  amount?: number;
};

export type AddPieceRegulDto = {
  amount: number;
};

export type UpdatePieceRegulDto = {
  amount: number;
};
