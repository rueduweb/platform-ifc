export type RegulFormItem = {
  id?: number;
  amount: number | null;
};

export type RegulFormModel = {
  license: string;
  items: RegulFormItem[];
};

