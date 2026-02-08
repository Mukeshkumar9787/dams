import React, { useCallback, useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import { getOrdersForUser } from "@/http/apiCalls";
import { Pagination } from "antd";

const Orders = () => {
  const [ordersData, setOrdersData] = useState<any>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ page: 1, pageSize: 10});

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getOrdersForUser({ ...pagination });
      setOrdersData(data?.data || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  },[fetchProducts])

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 p-3">
        {ordersData.length > 0 ? (
          ordersData.map((orderItem, key) => (
            <SingleOrder key={orderItem.id} orderItem={orderItem} smallView={true} />
          ))
        ) : (
          <p className="py-9.5 px-4 sm:px-7.5 xl:px-10">
            You don&apos;t have any orders!
          </p>
        )}
      </div>
      {ordersData.length > 0 && (
        <div className="w-full flex justify-end mb-2">
          <Pagination total={totalCount} pageSize={pagination.pageSize} current={pagination.page} onChange={(page, pageSize) => setPagination({page, pageSize})} />
        </div>
      )}
    </>
  );
};

export default Orders;
