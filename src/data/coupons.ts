import { CouponSchema } from '@/data/schema';

const rawCoupons = [
  {
    code: 'FIRSTSTEEP',
    discount_percentage: 10,
    description: '10% off your first order',
    min_order_amount: 0,
  },
  {
    code: 'TEATIME20',
    discount_percentage: 20,
    description: '20% off orders over $50',
    min_order_amount: 50,
  },
] as const satisfies readonly Record<string, unknown>[];

export const coupons = CouponSchema.array().parse(rawCoupons);
