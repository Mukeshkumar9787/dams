import React, { useCallback, useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import { getOrdersForUser } from "@/http/apiCalls";
import { Pagination } from "antd";

const Orders = () => {
  const [ordersData, setOrdersData] = useState<any>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ pageNumber: 1, pageSize: 5});

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getOrdersForUser({ ...pagination });
      setOrdersData(data?.data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
    }
  }, [pagination]);

  useEffect(() => {
    fetchProducts();
  },[fetchProducts])

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-1 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark">My Orders</h3>
          {ordersData.length > 0 && (
            <span className="text-xs font-medium text-dark-4 bg-gray-1/80 border border-gray-3 rounded-full px-3 py-1">
              {totalCount} total
            </span>
          )}
        </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
        {ordersData.length > 0 ? (
          ordersData.map((orderItem) => (
            <SingleOrder key={orderItem.orderNo} orderItem={orderItem} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-gray-3 bg-gray-1 px-6 py-10 text-center">
            <p className="text-dark-4">You don&apos;t have any orders yet.</p>
          </div>
        )}
      </div>
      {ordersData.length > 0 && (
        <div className="w-full flex justify-end mt-5">
          <Pagination total={totalCount} pageSize={pagination.pageSize} current={pagination.pageNumber} onChange={(page, pageSize) => setPagination({pageNumber: page, pageSize})} />
        </div>
      )}
      </div>
    </>
  );
};

export default Orders;
