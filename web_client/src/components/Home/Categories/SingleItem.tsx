import { Category } from "@/types/category";
import React from "react";

const SingleItem = ({ item, onClick }: { item: Category }) => {
  return (
    <a
      href="#"
      className="group flex h-full flex-col rounded-[28px] border border-white/80 bg-white/75 p-4 text-center shadow-[0_18px_38px_rgba(148,101,35,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#dcb67b] hover:bg-white"
      onClick={onClick}
    >
      <div className="mb-4 flex min-h-[148px] items-center justify-center rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(199,160,92,0.18),_transparent_42%),linear-gradient(180deg,#fffaf3_0%,#f4ede2_100%)] p-5">
        <img src={item.img} alt="Category" width={92} height={72} className="max-h-[84px] object-contain transition duration-300 group-hover:scale-105" />
      </div>

      <div className="mt-auto flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark transition duration-300 group-hover:text-[#a76d1e]">
          {item.title}
        </h3>
      </div>
    </a>
  );
};

export default SingleItem;
