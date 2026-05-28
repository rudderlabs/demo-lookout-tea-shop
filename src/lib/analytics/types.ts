export interface ProductPayload {
  product_id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  variant: string;
  price: number;
  currency: string;
  url: string;
  image_url: string;
}

export interface CartProductPayload extends ProductPayload {
  quantity: number;
  checkout_flow?: string;
}

export interface ProductListPayload {
  list_id: string;
  category: string;
  products: ProductPayload[];
}

export interface CartViewedPayload {
  cart_id: string;
  products: CartProductPayload[];
  value: number;
  currency: string;
}

export interface CheckoutStartedPayload {
  order_id: string;
  value: number;
  currency: string;
  products: CartProductPayload[];
  coupon?: string;
  checkout_flow?: string;
}

export interface CheckoutStepPayload {
  checkout_id: string;
  step: number;
  step_name: string;
}

export interface PaymentInfoPayload {
  checkout_id: string;
  order_id: string;
  step: number;
  payment_method: string;
}

export interface OrderCompletedPayload {
  order_id: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  currency: string;
  products: CartProductPayload[];
  coupon?: string;
  checkout_flow?: string;
}

export interface CouponPayload {
  coupon_id: string;
  coupon_name: string;
  discount: number;
  reason?: string;
}

export interface PromotionPayload {
  promotion_id: string;
  name: string;
  creative: string;
  position: string;
}

export interface SearchPayload {
  query: string;
}

export interface IdentifyTraits {
  email: string;
  name: string;
  first_name: string;
  last_name: string;
}
