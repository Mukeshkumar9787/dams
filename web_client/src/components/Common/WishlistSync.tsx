"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { getWishlist, replaceWishlist } from "@/http/apiCalls";
import { setWishlistItems } from "@/redux/features/wishlist-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";

type WishEntry = { id: number };

const normalize = (items: WishEntry[] = []) => {
  const uniqueIds = Array.from(new Set(items.map((item) => Number(item.id))))
    .filter((id) => Number.isInteger(id) && id > 0);
  return uniqueIds.map((id) => ({ id }));
};

const mergeUnique = (localItems: WishEntry[], serverItems: WishEntry[]) => {
  return normalize([...serverItems, ...localItems]);
};

const WishlistSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isInitializedRef = React.useRef(false);
  const skipNextSyncRef = React.useRef(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      isInitializedRef.current = true;
      return;
    }

    const initWishlist = async () => {
      try {
        const response = await getWishlist();
        const serverItems = normalize(response?.data || []);
        const localItems = normalize(wishlistItems || []);
        const merged = mergeUnique(localItems, serverItems);

        skipNextSyncRef.current = true;
        dispatch(setWishlistItems(merged));
      } finally {
        isInitializedRef.current = true;
      }
    };

    initWishlist();
    // Intentionally initialize once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  React.useEffect(() => {
    if (!isInitializedRef.current) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      const items = normalize(wishlistItems || []).map((item) => item.id);
      await replaceWishlist(items);
    }, 250);

    return () => clearTimeout(timeout);
  }, [wishlistItems]);

  return null;
};

export default WishlistSync;
