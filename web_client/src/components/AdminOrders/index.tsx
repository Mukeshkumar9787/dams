"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { getOrdersForAdmin } from "../../http/apiCalls.js";
import { Input, Table } from "antd"
import { ORDER_STATUS_COLOR } from "../../utils/constants.js"
import { ORDER_URL } from "@/utils/appUrls";
import { ExportOutlined } from "@ant-design/icons";
import StatusTags from "./StatusTags";
import OrderStats from "./OrderStatsCard"
import { getCurrencyDetails, getShippingDisplay } from "@/utils/helper";

const AdminOrders = () => {
  const [orderItems, setOrderItems] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ pageNumber: 1, pageSize: 10});
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersForAdmin({...pagination, search, status});
        setOrderItems(data?.data || []);
        setTotalCount(data?.totalCount || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [pagination, search, status]);
  const currency = getCurrencyDetails().currencySymbol;

  const columns = [
    {
      title: 'Image',
      dataIndex: 'filePath',
      key: 'filePath',
      render: (text) => {
        return <img className="h-14 w-14 rounded-lg border border-gray-3 object-cover" src={text}/>
      },
    },
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (orderNo) => <span className="font-medium text-dark">#{orderNo}</span>,
    },
    {
      title: 'Placed by',
      dataIndex: 'user',
      key: 'user',
      render: (user) => {
        return <div>{user?.name}</div>
      },
    },
    {
      title: 'Products',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => {
        return (
          <div className="text-center">
            {currency}{text}
          </div> )
      },
    },
    {
      title: 'Shipping Amount',
      dataIndex: 'shippingAmount',
      key: 'shippingAmount',
      render: (text) => {
        return (
          <div className="text-center">
            {getShippingDisplay(text)}
          </div> )
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return (
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={ORDER_STATUS_COLOR[text]}>
            {text}
          </span>
        )
      },
    },
    {
      title: 'View',
      dataIndex: 'orderNo',
      key: 'action',
      render: (orderNo) => {
        return(
          <Link
            href={ORDER_URL + `/${orderNo}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-3 text-dark hover:border-blue hover:text-blue transition"
          >
            <ExportOutlined size={20}/>
          </Link>
        )
      },
    }
  ]

  
  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Order"} pages={["Order"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
        <section className="page-section bg-gray-2/60">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <OrderStats />
            <div className="surface-card p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-dark">Order List</h2>
                  <p className="text-sm text-dark-4">Track and manage all customer orders.</p>
                </div>
              </div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="w-full max-w-[320px]">
                  <Input placeholder="Search orders" type="text" value={search} onChange={(e) => {setSearch(e.target.value);setPagination((prev) => ({...prev, pageNumber: 1}))}} />
                </div>
                <StatusTags status={status} setStatus={(value)=> {setStatus(value); setPagination((prev) => ({...prev, pageNumber: 1}))}} />
              </div>
              <Table dataSource={orderItems} columns={columns} rowKey="id"
                pagination={{
                  current: pagination.pageNumber,
                  pageSize: pagination.pageSize,
                  total: totalCount,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20'],
                  onChange(page, pageSize) {
                    setPagination({pageNumber: page, pageSize});
                  },
                }}
                locale={{ emptyText: "No orders found." }}
              />
            </div>
          </div>
        </section>
      
    </>
  );
};

export default AdminOrders;
