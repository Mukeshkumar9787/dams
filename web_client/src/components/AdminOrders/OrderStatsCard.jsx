import { getAdminDashboard } from "@/http/apiCalls";
import { getCurrencyDetails } from "@/utils/helper";
import { ORDER_STATUS, ORDER_STATUS_COLOR } from "@/utils/constants";
import React from "react";

const formatAmount = (value = 0) => {
  const amount = Number(value || 0);
  return `${getCurrencyDetails().currencySymbol}${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const OrderStats = () => {
  const [dashboardData, setDashboardData] = React.useState({});

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const reponse = await getAdminDashboard();
        if (reponse.success) {
          setDashboardData(reponse.data || {});
        }
      } catch (error) {}
    };
    fetchStats();
  }, []);

  const statusStats = dashboardData?.orderStatus || {};
  const overview = dashboardData?.overview || {};
  const salesTrend = dashboardData?.salesTrend || [];

  const stats = [
    {
      label: "Placed",
      key: ORDER_STATUS.PLACED,
      helper: "Awaiting processing",
    },
    {
      label: "Confirmed",
      key: ORDER_STATUS.CONFIRMED,
      helper: "Approved orders",
    },
    {
      label: "Shipped",
      key: ORDER_STATUS.SHIPPED,
      helper: "In transit now",
    },
    {
      label: "Delivered",
      key: ORDER_STATUS.DELIVERED,
      helper: "Completed orders",
    },
    {
      label: "Rejected",
      key: ORDER_STATUS.REJECTED,
      helper: "Declined orders",
    },
  ].map((item) => ({
    ...item,
    value: Number(statusStats[item.key] || 0),
    color: ORDER_STATUS_COLOR[item.key],
  }));

  const activePipelineCount = stats
    .filter((item) => item.key !== ORDER_STATUS.REJECTED)
    .reduce((sum, item) => sum + item.value, 0);

  const latestMonth = salesTrend[salesTrend.length - 1] || {};
  const previousMonth = salesTrend[salesTrend.length - 2] || {};
  const latestRevenue = Number(latestMonth.revenue || 0);
  const previousRevenue = Number(previousMonth.revenue || 0);
  const revenueDelta = previousRevenue > 0
    ? ((latestRevenue - previousRevenue) / previousRevenue) * 100
    : latestRevenue > 0
      ? 100
      : 0;

  const heroBackground = {
    background:
      "radial-gradient(circle at top left, rgba(14,165,233,0.18), transparent 28%), linear-gradient(135deg, #0f172a 0%, #132b4f 52%, #0f766e 100%)",
  };

  const salesCards = [
    {
      label: "Sales",
      value: formatAmount(overview.totalSales),
      helper: `${overview.salesOrderCount || 0} paid or fulfilled orders`,
    },
    {
      label: "AOV",
      value: formatAmount(overview.averageOrderValue),
      helper: "Average order value",
    },
    {
      label: latestMonth.label || "This Month",
      value: formatAmount(latestRevenue),
      helper: `${Number(latestMonth.orders || 0).toLocaleString("en-IN")} orders in month`,
    },
    {
      label: "Growth",
      value: `${revenueDelta >= 0 ? "+" : ""}${revenueDelta.toFixed(1)}%`,
      helper: previousMonth.label && latestMonth.label
        ? `${previousMonth.label} vs ${latestMonth.label}`
        : "Month-over-month revenue",
    },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
      <div className="px-6 py-7 sm:px-7 sm:py-8" style={heroBackground}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
              Orders Snapshot
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {Number(statusStats.ALL || 0).toLocaleString("en-IN")}
              </h2>
              <p className="mt-3 text-sm text-slate-200 sm:text-base">
                Revenue and order movement together, with a clearer view of pipeline pressure and monthly sales momentum.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Active</p>
                <p className="mt-2 text-2xl font-semibold text-white">{activePipelineCount.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Delivered</p>
                <p className="mt-2 text-2xl font-semibold text-white">{Number(statusStats[ORDER_STATUS.DELIVERED] || 0).toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Rejected</p>
                <p className="mt-2 text-2xl font-semibold text-white">{Number(statusStats[ORDER_STATUS.REJECTED] || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {salesCards.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-600">{item.helper}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-5">
        {stats.map((item) => (
          <div
            key={item.key}
            className="rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm"
          >
            <div
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={item.color}
            >
              {item.label}
            </div>
            <p
              className="mt-4 text-3xl font-semibold"
              style={{ color: item.color?.color }}
            >
              {item.value.toLocaleString("en-IN")}
            </p>
            <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStats;
