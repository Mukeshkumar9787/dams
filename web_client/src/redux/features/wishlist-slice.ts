import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  items: WishListItem[];
};

type WishListItem = {
  id: number;
};

const initialState: InitialState = {
  items: [],
};

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<WishListItem[]>) => {
      state.items = action.payload;
    },
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (!existingItem) state.items.push({ id });
    },
    removeItemFromWishlist: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    toggleWishlistItem: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      const exists = state.items.find((item) => item.id === itemId);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== itemId);
      } else {
        state.items.push({ id: itemId });
      }
    },

    removeAllItemsFromWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWishlistItems,
  addItemToWishlist,
  removeItemFromWishlist,
  toggleWishlistItem,
  removeAllItemsFromWishlist,
} = wishlist.actions;
export default wishlist.reducer;
