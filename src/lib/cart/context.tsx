'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import type { CartItem, Coupon, TeaProduct } from '@/data/schema';

import { cartReducer, initialCartState } from './reducer';
import type { CartState } from './types';

const STORAGE_KEY = 'serene-leaf-cart';

interface CartContextValue {
  items: CartItem[];
  coupon: Coupon | null;
  isHydrated: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addItem: (product: TeaProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromStorage(): Omit<CartState, 'isHydrated'> {
  if (typeof window === 'undefined') {
    return initialCartState;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialCartState;

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'items' in parsed &&
      Array.isArray((parsed as { items: unknown }).items)
    ) {
      const state = parsed as { items: CartItem[]; coupon: unknown };
      return {
        items: state.items,
        coupon:
          typeof state.coupon === 'object' && state.coupon !== null
            ? (state.coupon as Coupon)
            : null,
      };
    }

    return initialCartState;
  } catch {
    return initialCartState;
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Load persisted cart on mount
  useEffect(() => {
    const persisted = loadCartFromStorage();
    dispatch({
      type: 'HYDRATE',
      payload: { items: persisted.items, coupon: persisted.coupon },
    });
  }, []);

  // Persist cart to localStorage on state changes
  useEffect(() => {
    try {
      const { items, coupon } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }));
    } catch {
      // localStorage may be full or unavailable
    }
  }, [state]);

  const addItem = useCallback(
    (product: TeaProduct, quantity: number = 1): void => {
      dispatch({
        type: 'ADD_ITEM',
        payload: { ...product, quantity },
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', payload: { product_id: productId } });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number): void => {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { product_id: productId, quantity },
      });
    },
    [],
  );

  const applyCoupon = useCallback((coupon: Coupon): void => {
    dispatch({ type: 'APPLY_COUPON', payload: coupon });
  }, []);

  const removeCoupon = useCallback((): void => {
    dispatch({ type: 'REMOVE_COUPON' });
  }, []);

  const clearCart = useCallback((): void => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [state.items],
  );

  const discount = useMemo(
    () =>
      state.coupon && subtotal >= state.coupon.min_order_amount
        ? (subtotal * state.coupon.discount_percentage) / 100
        : 0,
    [subtotal, state.coupon],
  );

  const total = useMemo(() => subtotal - discount, [subtotal, discount]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      coupon: state.coupon,
      isHydrated: state.isHydrated,
      itemCount,
      subtotal,
      discount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
    }),
    [
      state.items,
      state.coupon,
      state.isHydrated,
      itemCount,
      subtotal,
      discount,
      total,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
