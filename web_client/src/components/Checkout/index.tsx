"use client";
import React, { useCallback, useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";
import { getLoggedInUserData, getProductCountFromCart, redirectToSignIn } from "@/utils/helper";
import Address from "./Address";
import { ADDRESS_TYPES, STATUS_TYPES } from "@/utils/constants";
import Notes from "./Notes";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { createOrder, getProducts, verifyPayment } from "@/http/apiCalls";
import OrderList from "./OrderList";
import { useDispatch } from "react-redux";
import { removeAllItemsFromCart, removeItemFromCart } from "@/redux/features/cart-slice";
import { handlePayment } from "@/utils/payment";
import { ORDER_URL } from "@/utils/appUrls";

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isDiffBillAdd, setIsDiffBillAddress] = React.useState(false);
  const [productItems, setProductItems] = useState([]);

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = parseFloat(productItems.reduce((acc, c) => acc + (c.price * getProductCountFromCart(c.id, cartItems)), 0));
  const handleRemoveFromCart = (id) => {
      dispatch(removeItemFromCart(id));
    };
  const fetchProducts = useCallback(async () => {
    try {
      if(cartItems.length === 0){
        setProductItems([]);
        return;
      }
      const data = await getProducts({
        productIds: cartItems.map(i => i.id),
        pagination: false,
        status: STATUS_TYPES.ACTIVE
      });
      const products = (data?.data || []).map(i => ({
        ...i, 
        quantity: getProductCountFromCart(i.id, cartItems),
       }))
      const currentRemovedItems = cartItems.filter(i => products.findIndex(p => p.id === i.id) === -1);
      currentRemovedItems.forEach(p => {
        handleRemoveFromCart(p.id);
      });
      setProductItems(products);
    } catch (err) {
      console.error(err);
    }
  }, [cartItems]);

  useEffect(() => {
    fetchProducts();
  },[fetchProducts])
  
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
      e.preventDefault()
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      const orderResponse = await createOrder({
        ...values, 
        isDiffBillAdd,
        orderProducts: productItems.map(i => ({
          productId: i.id, 
          title: i.title,
          price: i.price,
          mrp: i.mrp,
          quantity: i.quantity
        }))
      })
      if(orderResponse.success){
        if(orderResponse.data.payment){
          const onPaymentSuccess = async function (response) {
            const verifyRes = await verifyPayment(response);
            if (verifyRes) {
              window.location.href = `${ORDER_URL}/${orderResponse.data.orderNo}`
              if(verifyRes.success) {
                dispatch(removeAllItemsFromCart());
              }
            }
          }
          await handlePayment(orderResponse.data.payment, onPaymentSuccess);
        }else{
          window.alert("Payment Failed");
        }
      }else{
        fetchProducts()
      }
    } catch (error) {
      fetchProducts();
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
                <Address type={ADDRESS_TYPES.SHIP} isDiffBillAddress={isDiffBillAdd} setIsDiffBillAddress={setIsDiffBillAddress} />
                {isDiffBillAdd && <Address type={ADDRESS_TYPES.BILL} />}
                <Notes />
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <OrderList productItems={productItems} totalPrice={totalPrice} />

                {/* <!-- coupon box --> */}
                {/* <Coupon /> */}

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* <!-- checkout button --> */}
                <button
                  disabled={productItems.length === 0}
                  type="submit"
                  className={`w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 mt-7.5 ${(productItems.length === 0) && "bg-gray-4 text-gray"}`} 
                >
                  Pay Now
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
