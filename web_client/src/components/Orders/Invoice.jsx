"use client";
import { calculateInvoice, dateFormatter, getCurrencyDetails, getPriceWithoutTax } from "@/utils/helper";
import React, { forwardRef } from "react";

const OrderInvoice = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const {
    orderNo,
    createdAt,
    billingAddress,
    address,
    notes,
    products = [],
    shippingAmount = 0,
    totalPrice = 0,
    user,
    compInfo
  } = data;

  const currency = getCurrencyDetails().currencySymbol;
  const total = calculateInvoice(products);
  return (
    <div
      ref={ref}
      className="max-w-4xl mx-auto bg-white p-8 text-black print:p-4"
    >

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="w-full flex flex-col justify-end">
          <div className="text-2xl font-bold text-center">TAX INVOICE</div>
          <p className="font-semibold">{compInfo?.name}</p>
          <p>{compInfo?.address}</p>
          <p>{dateFormatter(new Date())}</p>
        </div>
      </div>

      {/* Order Info */}
      <div className="mt-6 text-sm space-y-1">
        <p><strong>Invoice No:</strong> {orderNo}</p>
        <p><strong>Order Date:</strong> {dateFormatter(createdAt)}</p>
      </div>

      {/* Customer Info */}
      <div className="mt-6 text-sm">
        <p><strong>Customer:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
        <div>
          <h2 className="font-semibold mb-2">Billing Address</h2>
          <p>{billingAddress}</p>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>{address}</p>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mt-6 text-sm">
          <h2 className="font-semibold">Notes</h2>
          <p>{notes}</p>
        </div>
      )}

      {/* Product Table */}
      <div className="mt-8">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2 text-center">Qty</th>
              <th className="border p-2 text-right">Price</th>
              <th className="border p-2 text-right">Tax</th>
              <th className="border p-2 text-right">Price (Including Tax)</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>

                <td className="border p-2 flex items-center gap-3">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-12 h-12 object-cover"
                  />
                  {product.title}
                </td>

                <td className="border p-2 text-center">
                  {product.quantity}
                </td>

                <td className="border p-2 text-right">
                  {currency} {getPriceWithoutTax(product.price, product.tax)}
                </td>

                 <td className="border p-2 text-right">
                  {product.tax}
                </td>

                {/* IMPORTANT: assuming backend already calculates item subtotal */}
                <td className="border p-2 text-right">
                  {currency} {product.price * product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals (Backend Driven) */}
      <div className="flex justify-end mt-6">
        <div className="w-64 text-sm">
          <div className="flex justify-between py-1 font-bold">
            <span>Sub Total</span>
            <span>
              {`${currency} ${total.subtotal}`}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span>Shipping</span>
            <span>
              {shippingAmount === 0
                ? "Free"
                : `${currency} ${shippingAmount}`}
            </span>
          </div>

          <div className="flex justify-between py-2 font-bold border-t">
            <span>Total</span>
            <span>{currency} {totalPrice}</span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-right">
        <p className="font-bold">Authorized Signature</p>
        <p className="mt-2">{compInfo?.name}</p>
      </div>

    </div>
  );
});

OrderInvoice.displayName = "OrderInvoice";

export default OrderInvoice;