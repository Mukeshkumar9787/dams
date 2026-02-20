"use client";
import React from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { getCurrencyDetails } from "@/utils/helper";
import AddToCart from "./AddToCart";
import AvailableStock from "./AvailableStock";


const ProductItem = ({ item }: { item: Product }) => {
  return (
    <div className="bg-white p-3 shodow-2 rounded-lg">
        <Link href={`/shop-details/${item.slug}`}> 
          <div className="relative overflow-hidden flex items-center justify-center rounded-lg">
            <img src={item.img} alt="" width={250} height={250} className="w-[300px] h-[200px]" />
          </div>
          <h3
            className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 mt-3"
          >
            {item.title} 
          </h3>
          <span className="flex items-center gap-2 font-medium text-lg">
            <span className="text-dark">{getCurrencyDetails().currencySymbol}{item.price}</span>
            <span className="text-dark-4 line-through">{getCurrencyDetails().currencySymbol}{item.mrp}</span>
          </span>
          <div className="my-2">
            <AvailableStock stock={item.stock} />
          </div>
        </Link>
        <AddToCart id={item.id} stock={item.stock} />
    </div>
  );
};

export default ProductItem;
