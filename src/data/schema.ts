import { z } from 'zod';

export const TeaProductSchema = z.object({
  product_id: z.string(),
  sku: z.string(),
  slug: z.string(),
  name: z.string(),
  brand: z.string().default('Tea Leafs'),
  category: z.enum([
    'green',
    'black',
    'oolong',
    'white',
    'herbal',
    'pu-erh',
  ]),
  variant: z.string(),
  price: z.number().positive(),
  currency: z.string().default('USD'),
  description: z.string(),
  origin: z.string(),
  caffeine_level: z.enum(['none', 'low', 'medium', 'high']),
  brew_temperature_celsius: z.number(),
  brew_time_seconds: z.number(),
  image_url: z.string(),
  url: z.string(),
  in_stock: z.boolean().default(true),
  rating: z.number().min(0).max(5),
  review_count: z.number().int().nonnegative(),
});

export type TeaProduct = z.infer<typeof TeaProductSchema>;

export const CartItemSchema = TeaProductSchema.extend({
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CouponSchema = z.object({
  code: z.string(),
  discount_percentage: z.number().min(0).max(100),
  description: z.string(),
  min_order_amount: z.number().nonnegative().default(0),
});

export type Coupon = z.infer<typeof CouponSchema>;

export const PromotionSchema = z.object({
  id: z.string(),
  name: z.string(),
  creative: z.string(),
  position: z.string(),
  description: z.string(),
  cta_text: z.string(),
  cta_url: z.string(),
});

export type Promotion = z.infer<typeof PromotionSchema>;

export const OrderSchema = z.object({
  order_id: z.string(),
  products: z.array(CartItemSchema),
  subtotal: z.number(),
  discount: z.number().default(0),
  shipping: z.number().default(0),
  tax: z.number().default(0),
  total: z.number(),
  currency: z.string().default('USD'),
  coupon: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;
