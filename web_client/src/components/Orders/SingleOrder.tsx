import React from "react";

import { dateFormatter, getCurrencyDetails } from "@/utils/helper";
import Link from "next/link";
import { ORDER_URL } from "@/utils/appUrls";
import { ExportOutlined } from "@ant-design/icons";
import { ORDER_STATUS_COLOR } from "@/utils/constants";

const SingleOrder = ({ orderItem }: any) => {
  return (
    <>
      <div className="bg-white border-white border rounded-md py-3 px-2 md:flex gap-2">
          <div className="flex justify-center">
            <img src={orderItem.filePath} alt="" className="w-full md:w-50" />
          </div>
        <div className="">
          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2"> Order:</span> #
              {orderItem.orderNo}
            </p>
          </div>
          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Item(s):</span> {orderItem.title}
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
                className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize`}
                style={ORDER_STATUS_COLOR[orderItem.status]}
              >
                {orderItem.status}
              </span>
            </p>
          </div>

          <div className="">
            <p className="text-custom-sm text-dark">
              <span className="font-bold pr-2">Total:</span>
              {getCurrencyDetails().currencySymbol}{orderItem.price}
            </p>
          </div>
          <div className="">
            <p className="text-custom-sm text-dark">
              <Link
                  href={ORDER_URL + `/${orderItem.orderNo}`}
                  className="inline-flex items-center gap-2 text-dark hover:text-green transition"
                  >
                  <span className="font-bold pr-2">View:</span>
                  <ExportOutlined  size={20}/>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrder;
