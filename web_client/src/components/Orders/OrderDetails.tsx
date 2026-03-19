"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrencyDetails,
  getLoggedInUserData,
  getShippingDisplay,
  isPrintEnable,
} from "@/utils/helper";
import {
  getConfig,
  getOrderDetailsBySlug,
  getOrderDetailsBySlugAdmin,
  raiseOrderDispute,
  updateOrderBySlugAdmin,
  updateOrderStatusBySlugAdmin,
} from "@/http/apiCalls";
import {
  CONFIG_KEYS,
  getNextOrderStatuses,
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
  ROLE_TYPES,
} from "@/utils/constants";
import Link from "next/link";
import { SHOP_DETAILS } from "@/utils/appUrls";
import { Input, Select } from "antd";
import ModalInfo from "../Common/ModalInfo";
import OrderStatusTimeline from "./OrderStatusHistory";
import OrderInvoice from "./Invoice";
import { useReactToPrint } from "react-to-print";
import CourierDetails from "./CourierDetails";
import { notifyError, notifySuccess } from "@/utils/notify";

const formatStatusLabel = (value) => value?.replaceAll("_", " ");

const OrderDetails = ({ params }) => {
  const [data, setData] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const componentRef = useRef(null);
  const [compInfo, setCompInfo] = React.useState({});
  const [couriers, setCouriers] = useState([]);
  const [disputeMessage, setDisputeMessage] = useState("");
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  const fetchOrder = useCallback(async () => {
    try {
      const userData = await getLoggedInUserData();
      let response = null;

      if (userData.role === ROLE_TYPES.ADMIN) {
        response = await getOrderDetailsBySlugAdmin(params);

        const modifiedData = {
          ...response?.data,
          isAdmin: true,
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
  }, [params]);

  const handleUpdateStatus = async () => {
    try {
      const response = await updateOrderStatusBySlugAdmin({ slug: params.slug, ...statusInfo });
      if (response.success) {
        notifySuccess("Order status changed successfully.");
        fetchOrder();
      }
    } catch (error) {}
  };

  const handleUpdateOrder = async (e) => {
    try {
      e.preventDefault();
      if (!data?.additionalInfo?.courier) {
        notifyError("Please select courier.");
        return;
      }
      if (!data?.additionalInfo?.trackingId) {
        notifyError("Please enter tracking ID.");
        return;
      }
      const response = await updateOrderBySlugAdmin({
        slug: params.slug,
        additionalInfo: data?.additionalInfo || {},
      });
      if (response.success) {
        notifySuccess("Courier details changed successfully.");
        fetchOrder();
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const additionalInfo = prev.additionalInfo || {};
      additionalInfo[name] = value;
      return { ...prev, additionalInfo };
    });
  };

  const handleRaiseDispute = async () => {
    const trimmedMessage = disputeMessage.trim();
    if (trimmedMessage.length < 5) {
      notifyError("Please enter at least 5 characters.");
      return;
    }

    try {
      setIsSubmittingDispute(true);
      const response = await raiseOrderDispute({
        slug: params.slug,
        message: trimmedMessage,
      });
      if (response.success) {
        notifySuccess(response.message || "Dispute raised successfully.");
        setIsDisputeModalOpen(false);
        setDisputeMessage("");
        fetchOrder();
      }
    } catch (error) {
      notifyError(error?.response?.data?.message || "Unable to raise dispute.");
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const fetchConfig = React.useCallback(async () => {
    try {
      const { success, data } = await getConfig({
        configs: [CONFIG_KEYS.COMP_INFO, CONFIG_KEYS.COURIER],
      });

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
  const orderStatusHistory = data?.orderStatusHistory || [];
  const currentComments =
    orderStatusHistory.find((item) => item.status === data?.status)?.meta?.comments || "";
  const dispute = data?.dispute;

  if (!data) return null;

  return (
    <>
      <div ref={componentRef} className="hidden print:block">
        <OrderInvoice data={{ ...data, compInfo }} />
      </div>
      <section className="overflow-hidden bg-gray-2 py-12 pt-5">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 xl:px-0">
          <form>
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fbff_46%,#eef6ff_100%)] shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                        Order Detail
                      </p>
                      <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
                        Order #{data?.orderNo}
                      </h1>
                      <p className="mt-2 text-sm text-slate-600">
                        {productItems.length} items • {data?.paymentType} payment
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span
                        className="inline-flex rounded-full px-4 py-2 text-sm font-semibold"
                        style={ORDER_STATUS_COLOR[data?.status]}
                      >
                        {formatStatusLabel(data?.status)}
                        {currentComments && ` (${currentComments})`}
                      </span>
                      {isPrintEnable(data?.status) && (
                        <button type="button" onClick={handlePrint} className="btn-primary px-5 text-sm">
                          Print Bill
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="surface-card p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                      Shipping
                    </p>
                    <h2 className="mt-3 text-lg font-semibold text-dark">Shipping Address</h2>
                    <p className="mt-3 whitespace-pre-line text-dark-4">{data?.address || "-"}</p>
                  </div>

                  <div className="surface-card p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                      Billing
                    </p>
                    <h2 className="mt-3 text-lg font-semibold text-dark">Billing Address</h2>
                    <p className="mt-3 whitespace-pre-line text-dark-4">
                      {data?.billingAddress || "-"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="surface-card p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                      Payment
                    </p>
                    <h2 className="mt-3 text-lg font-semibold text-dark">Payment Summary</h2>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-dark-4">Payment Type</span>
                        <span className="font-medium text-dark">{data?.paymentType || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-dark-4">Shipping</span>
                        <span className="font-medium text-dark">
                          {getShippingDisplay(data?.shippingAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t border-gray-3 pt-3">
                        <span className="text-base font-semibold text-dark">Total</span>
                        <span className="text-base font-semibold text-dark">
                          {getCurrencyDetails().currencySymbol} {totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="surface-card p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                      Notes
                    </p>
                    <h2 className="mt-3 text-lg font-semibold text-dark">Order Notes</h2>
                    <p className="mt-3 whitespace-pre-line text-dark-4">
                      {data?.notes || "No notes added for this order."}
                    </p>
                  </div>
                </div>

                {(dispute || !data?.isAdmin) && (
                  <div className="surface-card p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                          Dispute
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-dark">
                          Order dispute support
                        </h2>
                        {!dispute && (
                          <p className="mt-3 text-sm text-dark-4">
                            If there is an issue with this order, raise a dispute and the admin
                            team will be notified by email.
                          </p>
                        )}
                      </div>
                      {!data?.isAdmin && !dispute && (
                        <button
                          type="button"
                          onClick={() => setIsDisputeModalOpen(true)}
                          className="btn-primary px-5 text-sm"
                        >
                          Raise a Dispute
                        </button>
                      )}
                    </div>

                    {dispute ? (
                      <div className="mt-5 rounded-[24px] border border-red-100 bg-red-50/70 p-5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                            {dispute.status}
                          </span>
                          <span className="text-sm text-dark-4">
                            Raised on{" "}
                            {dispute.createdAt
                              ? new Date(dispute.createdAt).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                        <p className="mt-4 text-sm font-medium text-dark">
                          Raised by: {dispute.raisedByName || "Customer"}
                        </p>
                        <p className="mt-3 whitespace-pre-line text-dark-4">
                          {dispute.message}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-[24px] border border-dashed border-gray-3 bg-slate-50/60 p-5 text-sm text-dark-4">
                        No dispute has been raised for this order.
                      </div>
                    )}
                  </div>
                )}

                <div className="surface-card p-5 sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        Items
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-dark">
                        Products in this order
                      </h2>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {productItems.length} items
                    </div>
                  </div>
                  <div className="space-y-4">
                    {productItems.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col gap-4 rounded-[24px] border border-gray-3 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <Link href={`${SHOP_DETAILS}/${product.slug}`} className="flex-shrink-0">
                            <img
                              src={product.img}
                              className="h-20 w-20 rounded-2xl border border-gray-3 object-cover"
                              alt={product.title}
                            />
                          </Link>
                          <div className="min-w-0">
                            <Link
                              href={`${SHOP_DETAILS}/${product.slug}`}
                              className="block truncate font-semibold text-dark transition hover:text-blue"
                            >
                              {product.title}
                            </Link>
                            <p className="mt-1 text-sm text-dark-4">
                              Unit price: {currency}
                              {Number(product.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-6 sm:block sm:text-right">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-dark-4">Qty</p>
                            <p className="mt-1 font-medium text-dark">{product.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-dark-4">
                              Subtotal
                            </p>
                            <p className="mt-1 font-semibold text-dark">
                              {currency}
                              {parseFloat(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {statusInfo?.status && nextSteps.length > 0 && (
                  <div className="surface-card p-5 sm:p-6">
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        Status
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-dark">
                        Change Order Status
                      </h2>
                      <p className="mt-2 text-sm text-dark-4">
                        Move the order to its next valid stage.
                      </p>
                    </div>
                    <Select
                      value={statusInfo?.status}
                      onChange={(value) => setStatusInfo({ status: value, isConfirm: true })}
                      style={{ width: "100%" }}
                      className="bg-gray"
                    >
                      {nextSteps.map((item) => (
                        <Select.Option key={item} value={item}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                display: "inline-block",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                ...ORDER_STATUS_COLOR[item],
                              }}
                            />
                            {formatStatusLabel(item)}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                    <ModalInfo
                      content={
                        <div>
                          <div>
                            Are you proceed to{" "}
                            <span style={ORDER_STATUS_COLOR[statusInfo.status]}>
                              {" "}
                              {formatStatusLabel(statusInfo.status)}{" "}
                            </span>{" "}
                            this order ?
                          </div>
                          {[ORDER_STATUS.REJECTED].includes(statusInfo.status) && (
                            <Input
                              className="mt-3"
                              type="text"
                              placeholder="Enter comments"
                              value={statusInfo?.meta?.comments || ""}
                              onChange={(e) =>
                                setStatusInfo((prev) => ({
                                  ...prev,
                                  meta: { comments: e.target.value },
                                }))
                              }
                            />
                          )}
                        </div>
                      }
                      isOpen={statusInfo.isConfirm}
                      onClose={() => {
                        setStatusInfo({ status: data?.status });
                      }}
                      onOk={handleUpdateStatus}
                    />
                  </div>
                )}

                {(data?.isAdmin || data?.additionalInfo?.courier) && (
                  <div className="surface-card p-5 sm:p-6">
                    <CourierDetails
                      couriers={couriers}
                      handleChange={handleChange}
                      additionalInfo={data?.additionalInfo}
                      isAdmin={data?.isAdmin}
                      onSubmit={handleUpdateOrder}
                    />
                  </div>
                )}

                <div className="surface-card p-5 sm:p-6">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                      Timeline
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-dark">
                      Order Status History
                    </h2>
                  </div>
                  <OrderStatusTimeline history={orderStatusHistory} />
                </div>

                <div className="surface-card p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Snapshot
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-dark">Quick Summary</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-dark-4">
                        Current Status
                      </p>
                      <p className="mt-2 font-semibold text-dark">
                        {formatStatusLabel(data?.status)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-dark-4">Total Paid</p>
                      <p className="mt-2 font-semibold text-dark">
                        {getCurrencyDetails().currencySymbol} {totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <ModalInfo
        isOpen={isDisputeModalOpen}
        onClose={() => {
          if (isSubmittingDispute) return;
          setIsDisputeModalOpen(false);
        }}
        onOk={handleRaiseDispute}
        content={
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Raise dispute
            </p>
            <h2 className="mt-2 text-xl font-semibold text-dark">Report an issue with this order</h2>
            <p className="mt-3 text-sm text-dark-4">
              This message will be sent to the admin team and attached to the order.
            </p>
            <Input.TextArea
              className="mt-4"
              rows={5}
              maxLength={1000}
              placeholder="Describe the issue with this order"
              value={disputeMessage}
              onChange={(e) => setDisputeMessage(e.target.value)}
            />
          </div>
        }
      />
    </>
  );
};

export default OrderDetails;
