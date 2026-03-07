import React from "react";
import Link from "next/link";
import { useWishlistModalContext } from "@/app/context/WishlistSidebarModalContext";

const EmptyWishlist = () => {
  const { closeWishlistModal } = useWishlistModalContext();

  return (
    <div className="text-center bg-white p-3">
      <p className="pb-6">Your wishlist is empty!</p>
      <Link
        onClick={() => closeWishlistModal()}
        href="/shop"
        className="w-full lg:w-10/12 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyWishlist;
