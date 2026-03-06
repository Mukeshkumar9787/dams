"use client";
import React from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { getCurrencyDetails } from "@/utils/helper";
import AddToCart from "./AddToCart";
import AvailableStock from "./AvailableStock";


const ProductItem = ({ item }: { item: Product }) => {
  const discount = item?.mrp > item?.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

  return (
    <div className="group surface-card overflow-hidden p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <Link href={`/shop-details/${item.slug}`}> 
          <div className="relative overflow-hidden flex items-center justify-center rounded-xl bg-gray-1">
            <img
              src={item.img}
              alt={item.title}
              width={300}
              height={220}
              className="h-[220px] w-full object-cover transition duration-300 group-hover:scale-105"
            />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-blue px-2.5 py-1 text-xs font-semibold text-white">
                {discount}% OFF
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold text-dark ease-out duration-200 hover:text-blue mb-1.5 mt-3.5">
            {item.title}
          </h3>
          <span className="flex items-end gap-2 font-medium text-lg">
            <span className="text-dark text-xl leading-none">{getCurrencyDetails().currencySymbol}{item.price}</span>
            <span className="text-dark-4 line-through text-sm">{getCurrencyDetails().currencySymbol}{item.mrp}</span>
          </span>
          <div className="my-2.5">
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
