import type {
  ApiObject,
  IdentifyTraits as RudderIdentifyTraits,
  RudderAnalytics,
} from '@rudderstack/analytics-js';

import { ECOMMERCE_EVENTS } from './constants';
import type {
  CartProductPayload,
  CartViewedPayload,
  CheckoutStartedPayload,
  CheckoutStepPayload,
  CouponPayload,
  IdentifyTraits,
  OrderCompletedPayload,
  PaymentInfoPayload,
  ProductListPayload,
  ProductPayload,
  PromotionPayload,
  SearchPayload,
} from './types';

/**
 * Convert a product-like object into a ProductPayload.
 * Pure transform -- no side effects.
 */
export function toProductPayload(product: {
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
}): ProductPayload {
  return {
    product_id: product.product_id,
    sku: product.sku,
    name: product.name,
    brand: product.brand,
    category: product.category,
    variant: product.variant,
    price: product.price,
    currency: product.currency,
    url: product.url,
    image_url: product.image_url,
  };
}

/**
 * Helper to cast a typed payload to RudderStack's ApiObject.
 * Our typed payloads are structurally compatible with ApiObject
 * but TypeScript interfaces lack the index signature it requires.
 * Spreading into a fresh object produces a plain object literal
 * that we can safely cast.
 */
function toApiObject(payload: object): ApiObject {
  return { ...payload } as unknown as ApiObject;
}

export function trackProductsSearched(
  analytics: RudderAnalytics,
  payload: SearchPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PRODUCTS_SEARCHED, payload);
  analytics.track(ECOMMERCE_EVENTS.PRODUCTS_SEARCHED, toApiObject(payload));
}

export function trackProductListViewed(
  analytics: RudderAnalytics,
  payload: ProductListPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PRODUCT_LIST_VIEWED, payload);
  analytics.track(ECOMMERCE_EVENTS.PRODUCT_LIST_VIEWED, toApiObject(payload));
}

export function trackProductClicked(
  analytics: RudderAnalytics,
  payload: ProductPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PRODUCT_CLICKED, payload);
  analytics.track(ECOMMERCE_EVENTS.PRODUCT_CLICKED, toApiObject(payload));
}

export function trackProductViewed(
  analytics: RudderAnalytics,
  payload: ProductPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PRODUCT_VIEWED, payload);
  analytics.track(ECOMMERCE_EVENTS.PRODUCT_VIEWED, toApiObject(payload));
}

export function trackProductAdded(
  analytics: RudderAnalytics,
  payload: CartProductPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PRODUCT_ADDED, payload);
  analytics.track(ECOMMERCE_EVENTS.PRODUCT_ADDED, toApiObject(payload));
}

export function trackProductRemoved(
  analytics: RudderAnalytics,
  payload: CartProductPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PRODUCT_REMOVED, payload);
  analytics.track(ECOMMERCE_EVENTS.PRODUCT_REMOVED, toApiObject(payload));
}

export function trackProductAddedToWishlist(
  analytics: RudderAnalytics,
  payload: ProductPayload,
): void {
  console.log(
    '[Analytics]',
    ECOMMERCE_EVENTS.PRODUCT_ADDED_TO_WISHLIST,
    payload,
  );
  analytics.track(
    ECOMMERCE_EVENTS.PRODUCT_ADDED_TO_WISHLIST,
    toApiObject(payload),
  );
}

export function trackCartViewed(
  analytics: RudderAnalytics,
  payload: CartViewedPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.CART_VIEWED, payload);
  analytics.track(ECOMMERCE_EVENTS.CART_VIEWED, toApiObject(payload));
}

export function trackCouponApplied(
  analytics: RudderAnalytics,
  payload: CouponPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.COUPON_APPLIED, payload);
  analytics.track(ECOMMERCE_EVENTS.COUPON_APPLIED, toApiObject(payload));
}

export function trackCouponDenied(
  analytics: RudderAnalytics,
  payload: CouponPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.COUPON_DENIED, payload);
  analytics.track(ECOMMERCE_EVENTS.COUPON_DENIED, toApiObject(payload));
}

export function trackCheckoutStarted(
  analytics: RudderAnalytics,
  payload: CheckoutStartedPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.CHECKOUT_STARTED, payload);
  analytics.track(ECOMMERCE_EVENTS.CHECKOUT_STARTED, toApiObject(payload));
}

export function trackCheckoutStepViewed(
  analytics: RudderAnalytics,
  payload: CheckoutStepPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.CHECKOUT_STEP_VIEWED, payload);
  analytics.track(
    ECOMMERCE_EVENTS.CHECKOUT_STEP_VIEWED,
    toApiObject(payload),
  );
}

export function trackCheckoutStepCompleted(
  analytics: RudderAnalytics,
  payload: CheckoutStepPayload,
): void {
  console.log(
    '[Analytics]',
    ECOMMERCE_EVENTS.CHECKOUT_STEP_COMPLETED,
    payload,
  );
  analytics.track(
    ECOMMERCE_EVENTS.CHECKOUT_STEP_COMPLETED,
    toApiObject(payload),
  );
}

export function trackPaymentInfoEntered(
  analytics: RudderAnalytics,
  payload: PaymentInfoPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PAYMENT_INFO_ENTERED, payload);
  analytics.track(
    ECOMMERCE_EVENTS.PAYMENT_INFO_ENTERED,
    toApiObject(payload),
  );
}

export function trackOrderCompleted(
  analytics: RudderAnalytics,
  payload: OrderCompletedPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.ORDER_COMPLETED, payload);
  analytics.track(ECOMMERCE_EVENTS.ORDER_COMPLETED, toApiObject(payload));
}

export function trackPromotionViewed(
  analytics: RudderAnalytics,
  payload: PromotionPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PROMOTION_VIEWED, payload);
  analytics.track(ECOMMERCE_EVENTS.PROMOTION_VIEWED, toApiObject(payload));
}

export function trackPromotionClicked(
  analytics: RudderAnalytics,
  payload: PromotionPayload,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.PROMOTION_CLICKED, payload);
  analytics.track(ECOMMERCE_EVENTS.PROMOTION_CLICKED, toApiObject(payload));
}

export function identifyUser(
  analytics: RudderAnalytics,
  userId: string,
  traits: IdentifyTraits,
): void {
  console.log('[Analytics]', ECOMMERCE_EVENTS.IDENTIFY, { userId, traits });
  analytics.identify(userId, { ...traits } as RudderIdentifyTraits);
}
