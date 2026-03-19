"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useWishlistModalContext } from "@/app/context/WishlistSidebarModalContext";
import { useAppSelector } from "@/redux/store";
import { STATUS_TYPES } from "@/utils/constants";
import { getProducts } from "@/http/apiCalls";
import SingleItem from "./SingleItem";
import EmptyWishlist from "./EmptyWishlist";

const WishlistSidebarModal = () => {
  const { isWishlistModalOpen, closeWishlistModal } = useWishlistModalContext();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const [productItems, setProductItems] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      if (wishlistItems.length === 0) {
        setProductItems([]);
        return;
      }
      const data = await getProducts({
        productIds: wishlistItems.map((i) => i.id),
        pagination: false,
        status: STATUS_TYPES.ACTIVE,
      });
      setProductItems(data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [wishlistItems]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".wishlist-modal-content")) {
        closeWishlistModal();
      }
    }

    if (isWishlistModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWishlistModalOpen, closeWishlistModal]);

  return (
    <div
      className={`fixed top-0 left-0 z-99999 overflow-y-auto no-scrollbar w-full h-screen bg-dark/70 ease-linear duration-300 ${
        isWishlistModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-end">
        <div className="wishlist-modal-content relative flex h-screen w-full max-w-[540px] flex-col overflow-hidden border-l border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbff_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 pb-6 pt-5 backdrop-blur sm:px-7 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Saved List</p>
                <h2 className="mt-2 text-xl font-semibold text-dark sm:text-2xl">Wishlist View</h2>
                <p className="mt-2 text-sm text-dark-4">
                  {productItems.length} saved products ready to revisit.
                </p>
              </div>
            <button
              onClick={() => closeWishlistModal()}
              aria-label="button for close modal"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-dark-5 transition hover:bg-slate-200 hover:text-dark"
            >
              <svg
                className="fill-current"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5379 11.2121C12.1718 10.846 11.5782 10.846 11.212 11.2121C10.8459 11.5782 10.8459 12.1718 11.212 12.5379L13.6741 15L11.2121 17.4621C10.846 17.8282 10.846 18.4218 11.2121 18.7879C11.5782 19.154 12.1718 19.154 12.5379 18.7879L15 16.3258L17.462 18.7879C17.8281 19.154 18.4217 19.154 18.7878 18.7879C19.154 18.4218 19.154 17.8282 18.7878 17.462L16.3258 15L18.7879 12.5379C19.154 12.1718 19.154 11.5782 18.7879 11.2121C18.4218 10.846 17.8282 10.846 17.462 11.2121L15 13.6742L12.5379 11.2121Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 1.5625C7.57867 1.5625 1.5625 7.57867 1.5625 15C1.5625 22.4213 7.57867 28.4375 15 28.4375C22.4213 28.4375 28.4375 22.4213 28.4375 15C28.4375 7.57867 22.4213 1.5625 15 1.5625ZM3.4375 15C3.4375 8.61421 8.61421 3.4375 15 3.4375C21.3858 3.4375 26.5625 8.61421 26.5625 15C26.5625 21.3858 21.3858 26.5625 15 26.5625C8.61421 26.5625 3.4375 21.3858 3.4375 15Z"
                  fill=""
                />
              </svg>
            </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 lg:px-8">
            <div className="flex flex-col gap-6">
              {productItems.length > 0 ? (
                productItems.map((item) => <SingleItem key={item.id} item={item} />)
              ) : (
                <EmptyWishlist />
              )}
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-5 pb-5 pt-5 backdrop-blur sm:px-7 lg:px-8">
            <div className="rounded-[22px] bg-slate-50 px-4 py-4 text-sm text-dark-4">
              Keep products here while you compare styles, pricing, and availability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistSidebarModal;
