import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { dateFormatter, getCurrencyDetails } from "@/utils/helper";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  return (
    <>
      <div className="border border-rounded">
        <div className="py-4.5 px-7.5">
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
                    : "Unknown Status"
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
      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
