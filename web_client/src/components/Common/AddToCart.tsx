import React from "react";
import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { getProductCountFromCart } from "@/utils/helper";
import { useDispatch } from "react-redux";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const AddToCart = ({ id, align='center' }) => {
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useAppSelector((state) => state.cartReducer.items);

    const quantity = getProductCountFromCart(id, cartItems);

    const setQuantity = (quantity) => {
        dispatch(addItemToCart({id,quantity}));
    }
    // add to cart
    const handleAddToCart = () => {
        dispatch(addItemToCart({id,quantity: 1}));
    };

  if(quantity === 0) {
    return (
        <div className="flex items-center justify-center w-full">
            <button
                onClick={() => handleAddToCart()}
                className="inline-flex font-medium text-custom-sm py-[7px] px-7 rounded-[7px] bg-blue text-white hover:bg-blue-dark"
            >
                Add to cart
            </button>
        </div>
    )
  }
  return (
    <div className={`flex items-center justify-${align} w-full`}>
        <div className="flex items-center rounded-md border border-gray-3 bg-white w-1/2 h-7 text-xs">
            <button
                aria-label="button for remove product"
                className="flex items-center justify-center w-1/3 hover:text-blue"
                onClick={() =>setQuantity(quantity - 1)}
            >
                <MinusOutlined/>
            </button>

            <span className="flex items-center justify-center w-1/3  border-x border-gray-4">
                {quantity}
            </span>

            <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="button for add product"
                className="flex items-center justify-center w-1/3 hover:text-blue"
            >
                <PlusOutlined/>
            </button>
        </div>
    </div>
  );
};

export default AddToCart;
