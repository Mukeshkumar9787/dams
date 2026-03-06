import React from "react";

import { dateFormatter, getCurrencyDetails } from "@/utils/helper";
import Link from "next/link";
import { ORDER_URL } from "@/utils/appUrls";
import { ExportOutlined } from "@ant-design/icons";
import { ORDER_STATUS_COLOR } from "@/utils/constants";

const SingleOrder = ({ orderItem }: any) => {
  const imagePath = orderItem.filePath || "/images/products/product-01.png";

  return (
      <div className="surface-card p-4 sm:p-5 hover:shadow-md transition">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden border border-gray-3 bg-gray-1 flex items-center justify-center">
            <img src={imagePath} alt={orderItem.title || "order"} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-dark-4">Order #{orderItem.orderNo}</p>
                <h4 className="font-medium text-dark">{orderItem.title}</h4>
              </div>
              <span
                className="inline-flex items-center text-xs py-1 px-3 rounded-full capitalize"
                style={ORDER_STATUS_COLOR[orderItem.status]}
              >
                {orderItem.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p className="text-sm text-dark-4">
                <span className="font-medium text-dark">Date: </span>
                {dateFormatter(orderItem.createdAt)}
              </p>
              <p className="text-sm text-dark-4 sm:text-right">
                <span className="font-medium text-dark">Total: </span>
                {getCurrencyDetails().currencySymbol}{orderItem.totalAmount}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                href={ORDER_URL + `/${orderItem.orderNo}`}
                className="inline-flex items-center gap-2 rounded-md border border-gray-3 px-3 py-2 text-sm font-medium text-dark hover:border-blue hover:text-blue transition"
              >
                View Details
                <ExportOutlined size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SingleOrder;
