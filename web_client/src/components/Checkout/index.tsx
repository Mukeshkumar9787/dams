"use client";
import React, { useCallback, useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import PaymentMethod from "./PaymentMethod";
import { getLoggedInUserData, getProductCountFromCart, getShippingAmount, redirectToSignIn } from "@/utils/helper";
import Address from "./Address";
import { ADDRESS_TYPES, CONFIG_KEYS, STATUS_TYPES } from "@/utils/constants";
import Notes from "./Notes";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { createAddress, createOrder, deleteAddress, getAddress, getConfig, getProducts, updateAddress, verifyPayment } from "@/http/apiCalls";
import OrderList from "./OrderList";
import { useDispatch } from "react-redux";
import { removeAllItemsFromCart, removeItemFromCart } from "@/redux/features/cart-slice";
import { handlePayment } from "@/utils/payment";
import { ORDER_URL } from "@/utils/appUrls";
import Policy from "./Policy";
import { notifyError } from "@/utils/notify";

const initialCheckoutValues = {
  name: "",
  mobile: "",
  address: "",
  city: "",
  pincode: "",
  country: "",
  state: "",
  billingName: "",
  billingMobile: "",
  billingAddress: "",
  billingCity: "",
  billingPincode: "",
  billingCountry: "",
  billingState: "",
  gstNo: "",
  notes: "",
};

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [isDiffBillAdd, setIsDiffBillAddress] = React.useState(false);
  const [productItems, setProductItems] = useState([]);
  const [checkoutValues, setCheckoutValues] = useState(initialCheckoutValues);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({country: '', state: ''});
  const [shipData, setShipData] = React.useState({});
  const [compInfo, setCompInfo] = React.useState({});
  const [shippingAmount, setShippingAmount] = React.useState("");

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const shippingCost = (typeof(shippingAmount) === 'number') ? shippingAmount : 0; 
  const totalPrice = parseFloat(productItems.reduce((acc, c) => acc + (c.price * getProductCountFromCart(c.id, cartItems)), 0)) + (shippingCost);
  const handleRemoveFromCart = (id) => {
      dispatch(removeItemFromCart(id));
    };

  const fetchConfig = React.useCallback(async () => {
    try {
        const { success, data } = await getConfig({ configs: [CONFIG_KEYS.SHIPPING, CONFIG_KEYS.COMP_INFO] });
        if (!success) return;
        setShipData(data?.[CONFIG_KEYS.SHIPPING] ?? {});
        setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
    } catch (error) {
        console.error(error);
    }
    }, []);
    
  React.useEffect(() => {
      fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    setShippingInfo({
      country: checkoutValues.country,
      state: checkoutValues.state,
    });
  }, [checkoutValues.country, checkoutValues.state]);

  useEffect(()=> {
    setShippingAmount(getShippingAmount(shipData, shippingInfo))
  }, [shipData, shippingInfo])

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

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await getAddress();
      if (!response?.success) return;
      setSavedAddresses(response?.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  },[fetchProducts])
  
  useEffect(()=> {
    const navigateGuestUser = async() => {
      let user = await getLoggedInUserData();
      if(!user) {
        redirectToSignIn("/checkout");
        return;
      }
      fetchAddresses();
    }
    navigateGuestUser();
  },[fetchAddresses]);

  const isSameAddress = (current, existing) => {
    const normalize = (value) => (value || "").toString().trim().toLowerCase();
    return (
      normalize(current.name) === normalize(existing.name) &&
      normalize(current.mobile) === normalize(existing.mobile) &&
      normalize(current.address) === normalize(existing.address) &&
      normalize(current.city) === normalize(existing.city) &&
      normalize(current.pincode) === normalize(existing.pincode) &&
      normalize(current.country) === normalize(existing.country) &&
      normalize(current.state) === normalize(existing.state)
    );
  };

  const createShippingAddressIfNeeded = async () => {
    const shippingAddress = {
      name: checkoutValues.name,
      mobile: checkoutValues.mobile,
      address: checkoutValues.address,
      city: checkoutValues.city,
      pincode: checkoutValues.pincode,
      country: checkoutValues.country,
      state: checkoutValues.state,
    };
    const alreadyExists = savedAddresses.some((item) => isSameAddress(shippingAddress, item));
    if (alreadyExists) return;

    const response = await createAddress(shippingAddress);
    if (!response?.success) {
      throw new Error(response?.message || "Failed to save shipping address");
    }
    fetchAddresses();
  };

  const createBillingAddressIfNeeded = async () => {
    if (!isDiffBillAdd) return;

    const billingAddress = {
      name: checkoutValues.billingName,
      mobile: checkoutValues.billingMobile,
      address: checkoutValues.billingAddress,
      city: checkoutValues.billingCity,
      pincode: checkoutValues.billingPincode,
      country: checkoutValues.billingCountry,
      state: checkoutValues.billingState,
    };
    const alreadyExists = savedAddresses.some((item) => isSameAddress(billingAddress, item));
    if (alreadyExists) return;

    const response = await createAddress(billingAddress);
    if (!response?.success) {
      throw new Error(response?.message || "Failed to save billing address");
    }
    fetchAddresses();
  };
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await createShippingAddressIfNeeded();
      await createBillingAddressIfNeeded();
      const orderResponse = await createOrder({
        ...checkoutValues,
        shippingAmount,
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
          await handlePayment({...orderResponse.data.payment, compInfo }, onPaymentSuccess);
        }else{
          notifyError("Payment failed.");
        }
      }else{
        fetchProducts();
        fetchConfig();
      }
    } catch (error) {
      fetchConfig();
      fetchProducts();
    }
  };
  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="page-section bg-gray-2/60">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Address
                  type={ADDRESS_TYPES.SHIP}
                  isDiffBillAddress={isDiffBillAdd}
                  setIsDiffBillAddress={setIsDiffBillAddress}
                  checkoutValues={checkoutValues}
                  setCheckoutValues={setCheckoutValues}
                  savedAddresses={savedAddresses}
                  onAddAddress={createAddress}
                  onUpdateAddress={updateAddress}
                  onDeleteAddress={deleteAddress}
                  onRefreshAddresses={fetchAddresses}
                />
                {isDiffBillAdd && (
                  <Address
                    type={ADDRESS_TYPES.BILL}
                    checkoutValues={checkoutValues}
                    setCheckoutValues={setCheckoutValues}
                    savedAddresses={savedAddresses}
                    onAddAddress={createAddress}
                    onUpdateAddress={updateAddress}
                    onDeleteAddress={deleteAddress}
                    onRefreshAddresses={fetchAddresses}
                  />
                )}
                <Notes checkoutValues={checkoutValues} setCheckoutValues={setCheckoutValues} />
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <OrderList productItems={productItems} totalPrice={totalPrice} shippingAmount={shippingAmount} />

                {/* <!-- coupon box --> */}
                {/* <Coupon /> */}

                {/* <!-- payment box --> */}
                {/* <PaymentMethod /> */}
                <Policy />
                {/* <!-- checkout button --> */}
                <button
                  disabled={productItems.length === 0}
                  type="submit"
                  className={`w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 mt-7.5 ${(productItems.length === 0) && "bg-gray-4 text-gray"}`} 
                >
                  Pay Now
                </button>
                <div className="flex justify-end mt-2">
                  <img referrerPolicy="origin" src = "https://badges.razorpay.com/badge-light.png " width={130}  ></img>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
