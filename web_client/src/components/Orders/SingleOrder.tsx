import React from "react";

import { dateFormatter, getCurrencyDetails } from "@/utils/helper";

const SingleOrder = ({ orderItem }: any) => {
  return (
    <>
      <div className="border rounded-md py-3 px-2 md:flex gap-2 w-full">
          <div className="flex justify-center">
            <img src={orderItem.filePath} alt="" className="w-full md:w-50" />
          </div>
        <div className="">
          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2"> Order:</span> #
              {orderItem.orderNo.slice(-8)}
            </p>
          </div>
          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Date:</span>{" "}
              {dateFormatter(orderItem.createdAt)}
            </p>
          </div>

          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Status:</span>{" "}
              <span
                className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
                  orderItem.status === "delivered"
                    ? "text-green bg-green-light-6"
                    : orderItem.status === "on-hold"
                    ? "text-red bg-red-light-6"
                    : orderItem.status === "processing"
                    ? "text-yellow bg-yellow-light-4"
                    : "text-yellow bg-yellow-light-4"
                }`}
              >
                {orderItem.status}
              </span>
            </p>
          </div>

          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Title:</span> {orderItem.title}
            </p>
          </div>

          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Address:</span> {orderItem.address}
            </p>
          </div>

          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Total:</span>
              {getCurrencyDetails().currencySymbol}{orderItem.price}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrder;
