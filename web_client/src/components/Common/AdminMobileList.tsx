"use client";

import React from "react";
import { Pagination } from "antd";

type AdminMobilePagination = {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
};

type AdminMobileListProps<T> = {
  items: T[];
  emptyText: string;
  renderCard: (item: T, index: number) => React.ReactNode;
  pagination?: AdminMobilePagination;
};

const AdminMobileList = <T,>({
  items,
  emptyText,
  renderCard,
  pagination,
}: AdminMobileListProps<T>) => {
  return (
    <div className="space-y-4 md:hidden">
      {items.length > 0 ? (
        items.map((item, index) => <div key={index}>{renderCard(item, index)}</div>)
      ) : (
        <div className="admin-mobile-card text-sm text-dark-4">{emptyText}</div>
      )}

      {pagination && pagination.total > 0 ? (
        <div className="rounded-[24px] border border-gray-3 bg-white px-4 py-4 shadow-sm">
          <Pagination
            className="admin-mobile-pagination"
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            size="small"
            showSizeChanger
            pageSizeOptions={pagination.pageSizeOptions || ["10", "20"]}
            onChange={pagination.onChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AdminMobileList;
