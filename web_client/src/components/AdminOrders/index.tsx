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
        return <img className="w-20 h-20" src={text}/>
      },
    },
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
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
          <div className="w-full flex flex-row">
            <div className={`text-white px-4 py-2 rounded`} style={ORDER_STATUS_COLOR[text]}>{text}</div>
          </div> )
      },
    },
    {
      title: 'View',
      dataIndex: 'orderNo',
      key: 'action',
      render: (orderNo) => {
        return(
          <>
            <Link
                  href={ORDER_URL + `/${orderNo}`}
                  className="inline-flex items-center gap-2 text-dark hover:text-green transition"
                  >
                  <ExportOutlined  size={20}/>
            </Link>
          </>
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
        <section className="overflow-hidden py-10 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <OrderStats />
            <div className="flex items-center justify-between gap-5 mb-7.5">
              <div>
                <Input placeholder="Search" type="text" value={search} onChange={(e) => {setSearch(e.target.value);setPagination((prev) => ({...prev, pageNumber: 1}))}} />
              </div>
              < StatusTags status={status} setStatus={(value)=> {setStatus(value); setPagination((prev) => ({...prev, pageNumber: 1}))}} />
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
            />
          </div>
        </section>
      
    </>
  );
};

export default AdminOrders;
