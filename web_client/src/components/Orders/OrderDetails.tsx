"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { getCurrencyDetails, getLoggedInUserData } from "@/utils/helper";
import { getOrderDetailsBySlug, getOrderDetailsBySlugAdmin } from "@/http/apiCalls";
import { ORDER_STATUS_COLOR, ROLE_TYPES } from "@/utils/constants";
import Link from "next/link";
import { PRODUCT_URL, SHOP_DETAILS } from "@/utils/appUrls";
const OrderDetails = ({params}) => {
  const [data, setData] = useState(null);
  useEffect(()=>{
    const fetchOrder = async () => {
      const userData = await getLoggedInUserData();
      let response = null;
      if(userData.role === ROLE_TYPES.ADMIN){
        response = await getOrderDetailsBySlugAdmin(params);
      }else{
        response = await getOrderDetailsBySlug(params);
      }
      setData(response?.data);
    }
    fetchOrder()
  },[])
  const productItems = data?.products || [];
  const totalPrice = data?.totalPrice || 0;
  const currency = getCurrencyDetails().currencySymbol;
  return (
    <>
      <Breadcrumb title={"Order"} pages={["Order/", params?.slug]} />
      <section className="overflow-hidden py-20 pt-5 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 md:justify-center">
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Order-{data?.orderNo}
                    </h3>
                    <span className="font-medium text-xl text-dark" style={ORDER_STATUS_COLOR[data?.status]}>
                      {data?.status}
                    </span>
                  </div>

                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h2 className="font-medium text-dark">
                      Shipping&nbsp;Address:
                    </h2>
                    <h2 className="font-medium">
                      {data?.address}
                    </h2>
                  </div>

                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h2 className="font-medium text-dark">
                      Billing&nbsp;Address:
                    </h2>
                    <h2 className="font-medium">
                      {data?.billingAddress}
                    </h2>
                  </div>

                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h2 className="font-medium text-dark">
                      Payment:&nbsp;{data?.paymentType}
                    </h2>
                  </div>

                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h2 className="font-medium text-dark">
                      Notes:
                    </h2>
                    <h2 className="font-medium">
                      {data?.notes}
                    </h2>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark">Quantity</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>



                    {/* <!-- product item --> */}
                    {productItems.map(product =>
                      <div key={product.id} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div className="flex w-full">
                          <div>
                            <Link href={`${SHOP_DETAILS}/${product.slug}`} > <img src={product.img} className="w-20" alt={product.title} /> </Link> 
                            <div className="text-dark">{product.title}({currency}{product.price})</div>
                          </div>
                        </div>
                        <div className="w-1/2">{product.quantity}</div>
                        <div>
                          <p className="text-dark text-right">{currency}&nbsp;{parseFloat(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    )}

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {getCurrencyDetails().currencySymbol} {totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;
