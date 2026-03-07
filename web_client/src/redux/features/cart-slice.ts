import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { loadCartFromStorage, saveCartToStorage } from "../cartHelper"
type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  title?: string;
  price?: number;
  discountedPrice?: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};



const initialState: InitialState =
  loadCartFromStorage() ?? {
    items: [],
  };



export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<Array<{ id: number; quantity: number }>>) => {
      state.items = action.payload;
    },
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, quantity } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
        if(existingItem.quantity <= 0){
          state.items = state.items.filter((item) => item.id !== id);
        }
      } else {
        state.items.push({id,quantity});
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      saveCartToStorage(state);
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    const unitPrice = item.discountedPrice ?? item.price ?? 0;
    return total + unitPrice * item.quantity;
  }, 0);
});

export const {
  setCartItems,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
