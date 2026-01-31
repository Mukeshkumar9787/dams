"use client";
import React, { useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";
import { getLoggedInUserData, redirectToSignIn } from "@/utils/helper";
import CartSidebarModal from "../Common/CartSidebarModal";
import Address from "./Address";
import { ADDRESS_TYPES } from "@/utils/constants";
import Notes from "./Notes";
const Checkout = () => {
  const [isDiffBillAddress, setIsDiffBillAddress] = React.useState(false);
  useEffect(()=> {
    const navigateGuestUser = async() => {
      let user = await getLoggedInUserData();
      if(!user) {
        redirectToSignIn("/checkout");
      }
    }
    navigateGuestUser();
  },[]);
  const handleSubmit = async (e) => {
    try {
      // const response = 
    } catch (error) {
      
    }
  };
  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 pt-5 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Address type={ADDRESS_TYPES.SHIP} isDiffBillAddress={isDiffBillAddress} setIsDiffBillAddress={setIsDiffBillAddress} />
                {isDiffBillAddress && <Address type={ADDRESS_TYPES.BILL} />}
                <Notes />
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <CartSidebarModal isOrderSummary />

                {/* <!-- coupon box --> */}
                {/* <Coupon /> */}

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
