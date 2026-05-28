import type { CartAction, CartState } from './types';

export const initialCartState = {
  items: [],
  coupon: null,
  isHydrated: false,
} as const satisfies CartState;

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      return {
        items: action.payload.items,
        coupon: action.payload.coupon,
        isHydrated: true,
      };
    }

    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product_id === action.payload.product_id,
      );

      if (existingIndex >= 0) {
        const existingItem = state.items[existingIndex];
        if (!existingItem) return state;

        return {
          ...state,
          items: state.items.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product_id !== action.payload.product_id,
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product_id !== action.payload.product_id,
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.product_id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    }

    case 'APPLY_COUPON': {
      return {
        ...state,
        coupon: action.payload,
      };
    }

    case 'REMOVE_COUPON': {
      return {
        ...state,
        coupon: null,
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        coupon: null,
        isHydrated: state.isHydrated,
      };
    }
  }
}
