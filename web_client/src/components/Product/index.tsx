"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { getProducts } from "../../http/apiCalls.js";
import PlusIcon from "../Common/PlusIcon";
import { Input, Table } from "antd"
import { STATUS_COLOR, STATUS_TYPES } from "../../utils/constants.js"
import EditIcon from "../Common/EditIcon";
import { PRODUCT_NEW_URL, PRODUCT_URL } from "@/utils/appUrls";

const Product = () => {
  const [productItems, setProductItems] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ pageNumber: 1, pageSize: 10});
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({...pagination, search});
        setProductItems(data?.data || []);
        setTotalCount(data?.totalCount || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [pagination, search]);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'img',
      key: 'img',
      render: (text) => {
        return <img className="w-20 h-20" src={text}/>
      },
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let className = STATUS_COLOR.ACTIVE;
        if(text === STATUS_TYPES.INACTIVE){
          className = STATUS_COLOR.INACTIVE
        }
        return (
          <div className="w-full flex flex-row">
            <div className={`w-1/2 bg-${className} text-white px-4 py-2 rounded`}>{text}</div>
          </div> )
      },
    },
    {
      title: 'Action',
      dataIndex: 'slug',
      key: 'action',
      render: (slug) => {
        return(
          <>
            <Link
                  href={PRODUCT_URL + `/${slug}`}
                  className="inline-flex items-center gap-2 text-dark hover:text-green transition"
                  >
                  <EditIcon/ >
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
        <Breadcrumb title={"Product"} pages={["Product"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <div>
                <Input placeholder="Search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Link
                href={PRODUCT_NEW_URL}
                className="inline-flex items-center gap-2 text-dark hover:text-green transition"
              >
                <PlusIcon />
                <span>Add&nbsp;Product</span>
              </Link>
            </div>
            <Table dataSource={productItems} columns={columns} rowKey="id"
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

export default Product;
