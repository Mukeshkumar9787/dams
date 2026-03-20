import { Category } from "@/types/category";
import React from "react";

const SingleItem = ({ item, onClick }: { item: Category }) => {
  return (
    <a
      href="#"
      className="group flex h-full flex-col text-center transition duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="flex min-h-[165px] items-center justify-center overflow-hidden">
        <img
          src={item.img}
          alt="Category"
          width={108}
          height={88}
          className="max-h-[118px] object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-1">
        <h3 className="text-base font-semibold tracking-tight text-dark transition duration-300 group-hover:text-sky-700">
          {item.title}
        </h3>
      </div>
    </a>
  );
};

export default SingleItem;
