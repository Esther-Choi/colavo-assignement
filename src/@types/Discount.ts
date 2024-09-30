export type Discount = {
  name: string;
  rate: number;
};

export type DiscountWithTargets = Discount & { targets: string[] };
