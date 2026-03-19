"use client";

import React from "react";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { getOrderStats, getOrdersForAdmin, getProducts } from "@/http/apiCalls";
import { getCurrencyDetails, getLoggedInUserData, getShippingDisplay, getStoredToken, redirectToSignIn } from "@/utils/helper";
import { ORDER_STATUS, ORDER_STATUS_COLOR, ROLE_TYPES, STATUS_TYPES } from "@/utils/constants";
import { ORDER_URL } from "@/utils/appUrls";

const SALES_STATUSES = new Set([
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
]);

const ORDER_STATUS_SEQUENCE = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.REJECTED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.PAYMENT_FAILED,
];

const getLastSixMonths = () => {
  const months = [];
  const now = new Date();

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      amount: 0,
    });
  }

  return months;
};

const formatAmount = (value = 0) => {
  const amount = Number(value || 0);
  return `${getCurrencyDetails().currencySymbol}${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [statusStats, setStatusStats] = React.useState({});

  React.useEffect(() => {
    const loadDashboard = async () => {
      if (!getStoredToken()) {
        redirectToSignIn("/dashboard");
        return;
      }

      try {
        const user = await getLoggedInUserData();

        if (!user) {
          redirectToSignIn("/dashboard");
          return;
        }

        if (user.role !== ROLE_TYPES.ADMIN) {
          window.location.href = "/";
          return;
        }

        const [orderStatsResponse, ordersResponse, productsResponse] = await Promise.all([
          getOrderStats(),
          getOrdersForAdmin({ pageNumber: 1, pageSize: 500 }),
          getProducts({ pagination: false }),
        ]);

        setStatusStats(orderStatsResponse?.data?.orderStatus || {});
        setOrders(ordersResponse?.data || []);
        setProducts(productsResponse?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const salesOrders = React.useMemo(
    () => orders.filter((order) => SALES_STATUSES.has(order.status)),
    [orders]
  );

  const totalSales = React.useMemo(
    () => salesOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [salesOrders]
  );

  const totalStockUnits = React.useMemo(
    () => products.reduce((sum, product) => sum + Number(product.stock || 0), 0),
    [products]
  );

  const outOfStockCount = React.useMemo(
    () => products.filter((product) => Number(product.stock || 0) <= 0).length,
    [products]
  );

  const lowStockProducts = React.useMemo(
    () =>
      products
        .filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5)
        .sort((first, second) => Number(first.stock || 0) - Number(second.stock || 0))
        .slice(0, 5),
    [products]
  );

  const lowStockCount = React.useMemo(
    () => products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5).length,
    [products]
  );

  const recentOrders = React.useMemo(() => orders.slice(0, 8), [orders]);

  const salesTrend = React.useMemo(() => {
    const months = getLastSixMonths();

    salesOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = months.find((item) => item.key === key);

      if (month) {
        month.amount += Number(order.totalAmount || 0);
      }
    });

    return months;
  }, [salesOrders]);

  const stockBuckets = React.useMemo(() => {
    const buckets = [
      { label: "Out of Stock", value: 0, color: "#d92d20" },
      { label: "Low Stock", value: 0, color: "#f79009" },
      { label: "Healthy", value: 0, color: "#1570ef" },
      { label: "High Stock", value: 0, color: "#039855" },
    ];

    products.forEach((product) => {
      const stock = Number(product.stock || 0);

      if (stock <= 0) {
        buckets[0].value += 1;
      } else if (stock <= 5) {
        buckets[1].value += 1;
      } else if (stock <= 20) {
        buckets[2].value += 1;
      } else {
        buckets[3].value += 1;
      }
    });

    return buckets;
  }, [products]);

  const statusChartData = React.useMemo(
    () =>
      ORDER_STATUS_SEQUENCE.map((status) => ({
        label: status.replaceAll("_", " "),
        value: Number(statusStats?.[status] || 0),
      })),
    [statusStats]
  );

  const summaryCards = [
    {
      label: "Sales",
      value: formatAmount(totalSales),
      detail: `${salesOrders.length} paid or fulfilled orders`,
      accent: "from-[#0f766e] via-[#14b8a6] to-[#99f6e4]",
    },
    {
      label: "Products",
      value: products.length.toLocaleString("en-IN"),
      detail: `${products.filter((item) => item.status === STATUS_TYPES.ACTIVE).length} active listings`,
      accent: "from-[#1d4ed8] via-[#3b82f6] to-[#bfdbfe]",
    },
    {
      label: "Stock Units",
      value: totalStockUnits.toLocaleString("en-IN"),
      detail: `${outOfStockCount} products out of stock`,
      accent: "from-[#9f1239] via-[#f43f5e] to-[#fecdd3]",
    },
  ];

  const maxSalesValue = Math.max(...salesTrend.map((item) => item.amount), 1);
  const maxStatusValue = Math.max(...statusChartData.map((item) => item.value), 1);
  const maxStockBucketValue = Math.max(...stockBuckets.map((item) => item.value), 1);

  return (
    <>
      <section>
        <Breadcrumb title={"Dashboard"} pages={["Dashboard"]} />
      </section>

      <section className="page-section bg-gray-2/60">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="mb-6 rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),linear-gradient(135deg,#07111f_0%,#102541_55%,#173f6b_100%)] p-6 text-white shadow-[0_24px_80px_rgba(7,17,31,0.28)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[620px]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                  Admin Overview
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Sales, catalog, and stock health in one screen.
                </h1>
                <p className="mt-3 text-sm text-slate-200 sm:text-base">
                  This dashboard summarizes revenue momentum, order movement, and inventory pressure so the admin can start from signals instead of tables.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Orders</p>
                  <p className="mt-2 text-2xl font-semibold">{Number(statusStats?.ALL || orders.length).toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Low Stock</p>
                  <p className="mt-2 text-2xl font-semibold">{lowStockCount.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Out Of Stock</p>
                  <p className="mt-2 text-2xl font-semibold">{outOfStockCount.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="surface-card p-8 text-center text-dark-4">Loading dashboard...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className={`overflow-hidden rounded-[24px] bg-gradient-to-br ${card.accent} p-[1px] shadow-lg`}
                  >
                    <div className="h-full rounded-[23px] bg-white px-5 py-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                        {card.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-dark">{card.value}</p>
                      <p className="mt-2 text-sm text-dark-4">{card.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
                <div className="surface-card p-5 sm:p-7">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-dark">Sales Trend</h2>
                      <p className="text-sm text-dark-4">Last 6 months based on placed, confirmed, shipped, and delivered orders.</p>
                    </div>
                    <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                      {formatAmount(totalSales)}
                    </div>
                  </div>

                  <div className="grid h-[260px] grid-cols-6 items-end gap-3">
                    {salesTrend.map((item) => (
                      <div key={item.key} className="flex h-full flex-col justify-end">
                        <div className="mb-2 text-center text-xs font-medium text-dark-4">
                          {item.amount ? formatAmount(item.amount) : "0"}
                        </div>
                        <div className="relative flex-1 rounded-2xl bg-slate-100">
                          <div
                            className="absolute bottom-0 left-0 right-0 rounded-2xl bg-[linear-gradient(180deg,#0f766e_0%,#14b8a6_100%)]"
                            style={{ height: `${Math.max((item.amount / maxSalesValue) * 100, item.amount ? 12 : 0)}%` }}
                          />
                        </div>
                        <div className="mt-3 text-center text-sm font-medium text-dark">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card p-5 sm:p-7">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-dark">Order Status Mix</h2>
                    <p className="text-sm text-dark-4">Current distribution across the full order pipeline.</p>
                  </div>

                  <div className="space-y-4">
                    {statusChartData.map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-dark">{item.label}</span>
                          <span className="text-dark-4">{item.value}</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className="h-3 rounded-full bg-[linear-gradient(90deg,#1d4ed8_0%,#38bdf8_100%)]"
                            style={{ width: `${(item.value / maxStatusValue) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.05fr_1.25fr]">
                <div className="surface-card p-5 sm:p-7">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-dark">Stock Health</h2>
                    <p className="text-sm text-dark-4">Inventory grouped by pressure level so replenishment risk is obvious.</p>
                  </div>

                  <div className="space-y-4">
                    {stockBuckets.map((bucket) => (
                      <div key={bucket.label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-dark">{bucket.label}</span>
                          <span className="text-dark-4">{bucket.value}</span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-100">
                          <div
                            className="h-3 rounded-full"
                            style={{
                              width: `${(bucket.value / maxStockBucketValue) * 100}%`,
                              backgroundColor: bucket.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card p-5 sm:p-7">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-dark">Low Stock Watchlist</h2>
                      <p className="text-sm text-dark-4">Products most likely to need intervention soon.</p>
                    </div>
                    <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                      {lowStockCount} urgent
                    </div>
                  </div>

                  <div className="space-y-3">
                    {lowStockProducts.length ? (
                      lowStockProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-gray-3 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-dark">{product.title}</p>
                            <p className="text-sm text-dark-4">
                              {product.categoryName || "Uncategorized"} • {product.status}
                            </p>
                          </div>
                          <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                            {product.stock} left
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-3 px-5 py-8 text-center text-dark-4">
                        No low-stock products right now.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="surface-card p-5 sm:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-dark">Recent Orders</h2>
                    <p className="text-sm text-dark-4">Latest customer orders directly on the admin landing screen.</p>
                  </div>
                  <Link
                    href={ORDER_URL}
                    className="inline-flex items-center rounded-full border border-gray-3 px-4 py-2 text-sm font-medium text-dark transition hover:border-blue hover:text-blue"
                  >
                    View all orders
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  {recentOrders.length ? (
                    <table className="min-w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-dark-4">
                          <th className="px-4 py-2 font-semibold">Order</th>
                          <th className="px-4 py-2 font-semibold">Customer</th>
                          <th className="px-4 py-2 font-semibold">Products</th>
                          <th className="px-4 py-2 font-semibold">Total</th>
                          <th className="px-4 py-2 font-semibold">Shipping</th>
                          <th className="px-4 py-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="rounded-2xl bg-slate-50">
                            <td className="rounded-l-2xl px-4 py-4 align-top">
                              <Link
                                href={`${ORDER_URL}/${order.orderNo}`}
                                className="font-semibold text-dark transition hover:text-blue"
                              >
                                #{order.orderNo}
                              </Link>
                              <p className="mt-1 text-sm text-dark-4">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </td>
                            <td className="px-4 py-4 align-top text-sm text-dark">
                              {order.user?.name || "Guest"}
                            </td>
                            <td className="px-4 py-4 align-top text-sm text-dark">
                              <div className="max-w-[280px] truncate">{order.title}</div>
                            </td>
                            <td className="px-4 py-4 align-top text-sm font-medium text-dark">
                              {formatAmount(order.totalAmount)}
                            </td>
                            <td className="px-4 py-4 align-top text-sm text-dark">
                              {getShippingDisplay(order.shippingAmount)}
                            </td>
                            <td className="rounded-r-2xl px-4 py-4 align-top">
                              <span
                                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                style={ORDER_STATUS_COLOR[order.status]}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-3 px-5 py-8 text-center text-dark-4">
                      No orders found yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
