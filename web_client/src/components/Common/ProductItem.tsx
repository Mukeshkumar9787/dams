"use client";
import React from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { getCurrencyDetails } from "@/utils/helper";
import AddToCart from "./AddToCart";
import AvailableStock from "./AvailableStock";
import WishlistButton from "./WishlistButton";

const renderStars = (rating = 0, size = 14) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={i <= rounded ? "fill-[#FFA645]" : "fill-gray-3"}
          width={size}
          height={size}
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z" />
        </svg>
      ))}
    </div>
  );
};

const ProductItem = ({ item }: { item: Product }) => {
  const discount = item?.mrp > item?.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
  const reviewCount = Number(item?.reviewCount || 0);

  return (
    <div className="group surface-card overflow-hidden p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <Link href={`/shop-details/${item.slug}`}> 
          <div className="relative overflow-hidden flex items-center justify-center rounded-xl bg-gray-1 p-3 sm:p-0">
            <img
              src={item.img}
              alt={item.title}
              width={300}
              height={220}
              className="h-[180px] w-full object-contain transition duration-300 group-hover:scale-105 sm:h-[220px] sm:object-cover"
            />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-blue px-2.5 py-1 text-xs font-semibold text-white">
                {discount}% OFF
              </span>
            )}
            <div className="absolute right-3 top-3 z-10">
              <WishlistButton productId={item.id} compact />
            </div>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold text-dark ease-out duration-200 hover:text-blue mb-1.5 mt-3.5">
            {item.title}
          </h3>
          <span className="flex items-end gap-2 font-medium text-lg">
            <span className="text-dark text-xl leading-none">{getCurrencyDetails().currencySymbol}{item.price}</span>
            <span className="text-dark-4 line-through text-sm">{getCurrencyDetails().currencySymbol}{item.mrp}</span>
          </span>
          <div className="my-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            {reviewCount > 0 && (
              <div className="flex items-center">
                {renderStars(item?.avgRating || 0)}
              </div>
            )}
            <AvailableStock stock={item.stock} />
          </div>
        </Link>
        <div className="pt-1.5 border-t border-gray-3/70">
          <AddToCart id={item.id} stock={item.stock} />
        </div>
    </div>
  );
};

export default ProductItem;
