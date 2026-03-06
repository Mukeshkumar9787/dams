"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { getCurrencyDetails, getLoggedInUserData, getShippingDisplay, isPrintEnable } from "@/utils/helper";
import { getConfig, getOrderDetailsBySlug, getOrderDetailsBySlugAdmin, updateOrderBySlugAdmin, updateOrderStatusBySlugAdmin } from "@/http/apiCalls";
import { CONFIG_KEYS, getNextOrderStatuses, ORDER_STATUS, ORDER_STATUS_COLOR, ROLE_TYPES } from "@/utils/constants";
import Link from "next/link";
import { SHOP_DETAILS } from "@/utils/appUrls";
import { Button, Input, Select } from "antd";
import ModalInfo from "../Common/ModalInfo";
import OrderStatusTimeline from "./OrderStatusHistory";
import OrderInvoice from "./Invoice";
import { useReactToPrint } from "react-to-print";
import CourierDetails from "./CourierDetails";
import { notifyError, notifySuccess } from "@/utils/notify";

const OrderDetails = ({params}) => {
  const [data, setData] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const componentRef = useRef(null);
  const [compInfo, setCompInfo] = React.useState({});
  const [couriers, setCouriers] = useState([]);


  const handlePrint = useReactToPrint({contentRef: componentRef});

  const fetchOrder = useCallback(async () => {
    try {
      const userData = await getLoggedInUserData();
      let response = null;

      if (userData.role === ROLE_TYPES.ADMIN) {
        response = await getOrderDetailsBySlugAdmin(params);

        const modifiedData = {
          ...response?.data,
          isAdmin: true
        };

        setStatusInfo({ status: modifiedData?.status });
        setData(modifiedData);
      } else {
        response = await getOrderDetailsBySlug(params);
        setData(response?.data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  }, []);

  const handleUpdateStatus = async() => {
    try {
      const response = await updateOrderStatusBySlugAdmin({slug: params.slug, ...statusInfo});
      if(response.success){
        notifySuccess("Order status changed successfully.");
        fetchOrder();
      }
    } catch (error) {
      
    }
  }

  const handleUpdateOrder = async(e) => {
    try {
      e.preventDefault();
      if(!data?.additionalInfo?.courier){
        notifyError("Please select courier.");
        return;
      }
      if(!data?.additionalInfo?.trackingId){
        notifyError("Please enter tracking ID.");
        return;
      }
      const response = await updateOrderBySlugAdmin({slug: params.slug, additionalInfo: (data?.additionalInfo || {})});
      if(response.success){
        notifySuccess("Courier details changed successfully.");
        fetchOrder();
      }
    } catch (error) {
      
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => {
      let additionalInfo = prev.additionalInfo || {};
      additionalInfo[name] = value;
      return {...prev, additionalInfo};
    });
  }

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  
    const fetchConfig = React.useCallback(async () => {
      try {
        const { success, data } = await getConfig({ configs: [CONFIG_KEYS.COMP_INFO, CONFIG_KEYS.COURIER] });
  
        if (!success) return;
  
        setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
        setCouriers(data?.[CONFIG_KEYS.COURIER] || []);
      } catch (error) {
        console.error(error);
      }
    }, []);
    
    React.useEffect(() => {
      fetchConfig();
    }, [fetchConfig]);

  const productItems = data?.products || [];
  const totalAmount = data?.totalAmount || 0;
  const currency = getCurrencyDetails().currencySymbol;
  const nextSteps = getNextOrderStatuses(data?.status);
  const orderStatusHistory = (data?.orderStatusHistory || []);
  const currentComments = orderStatusHistory.find(i => i.status === data?.status)?.meta?.comments || '';
  if(!data) return null;
  return (
    <>
      <Breadcrumb title={"Order"} pages={["Order/", params?.slug]} />
      <div ref={componentRef} className="hidden print:block">
        <OrderInvoice data={{...data, compInfo}} />
      </div>
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
                    <span className="font-medium text-xl text-dark flex justify-between items-center">
                      <p style={ORDER_STATUS_COLOR[data?.status]}>
                      {data?.status}{currentComments && `(${currentComments})`} 
                      </p>
                      {isPrintEnable(data?.status) && 
                        <button type="button" onClick={handlePrint} className="bg-blue text-white p-2 text-sm rounded-md"> Print Bill</button>
                      }
                    </span>
                  </div>
                  {(data?.isAdmin || data?.additionalInfo?.courier) &&
                    <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                      <CourierDetails couriers={couriers} handleChange={handleChange} additionalInfo={data?.additionalInfo} isAdmin={data?.isAdmin} onSubmit={handleUpdateOrder} />
                    </div>
                  }
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
                    <div className="flex items-center justify-between pt-5 border-b border-gray-3">
                      <div>
                        <p className="">Shipping Amount</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">
                          {getShippingDisplay(data?.shippingAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {getCurrencyDetails().currencySymbol} {totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>


                    {
                      statusInfo?.status && (nextSteps.length > 0)
                      && 
                      <>
                      <div className="flex items-center justify-between pt-5">
                        <div>
                          <p className="font-medium text-lg text-dark">Change Status</p>
                        </div>
                        <div>
                        <p className="font-medium text-lg text-dark text-right">
                          <Select value={statusInfo?.status} onChange={(value) => setStatusInfo({status: value, isConfirm: true})} style={{ width: 200 }} className="h-13 bg-gray">
                            {nextSteps.map(item => (
                              <Select.Option key={item} value={item}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span
                                    style={{
                                      width: 16,
                                      height: 16,
                                      display: 'inline-block',
                                      borderRadius: 4,
                                      border: '1px solid #ccc',
                                      ...ORDER_STATUS_COLOR[item]
                                    }}
                                  />
                                  {item}
                                </div>
                              </Select.Option>
                            ))}
                          </Select>
                        </p>
                        </div>
                      </div>
                      <ModalInfo content={
                          <div>
                            <div>
                              Are you proceed to <span style={ORDER_STATUS_COLOR[statusInfo.status]}> {statusInfo.status} </span> this order ?
                            </div>
                            {
                              [ORDER_STATUS.REJECTED].includes(statusInfo.status)
                              &&
                              <Input className="mt-3" type="text" placeholder="Enter comments" value={statusInfo?.meta?.comments || ''} 
                                onChange={(e) => setStatusInfo(prev => ({...prev, meta: {comments: e.target.value}}))} 
                              />
                            }
                          </div>} isOpen={statusInfo.isConfirm} 
                        onClose={()=>{setStatusInfo({status: data?.status})}} onOk={handleUpdateStatus} />
                      </>
                    }
                    <div className="pt-5 border-t border-gray-3">
                      <OrderStatusTimeline history={orderStatusHistory} />
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
