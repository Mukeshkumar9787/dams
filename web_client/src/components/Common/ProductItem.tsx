"use client";
import React from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { getCurrencyDetails } from "@/utils/helper";
import AddToCart from "./AddToCart";


const ProductItem = ({ item }: { item: Product }) => {
  return (
    <div className="bg-white p-1 py-3">
        <Link href={`/shop-details/${item.slug}`}> 
          <div className="relative overflow-hidden flex items-center justify-center rounded-lg min-h-[270px] mb-4">
            <img src={item.img} alt="" width={250} height={250} />
          </div>
          <h3
            className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5"
          >
            {item.title} 
          </h3>
          <span className="flex items-center gap-2 font-medium text-lg">
            <span className="text-dark">{getCurrencyDetails().currencySymbol}{item.price}</span>
            <span className="text-dark-4 line-through">{getCurrencyDetails().currencySymbol}{item.mrp}</span>
          </span>
        </Link>
        <AddToCart id={item.id} stock={item.stock} />
    </div>
  );
};

export default ProductItem;
