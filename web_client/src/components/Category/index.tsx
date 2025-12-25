"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { getCategories } from "../../http/apiCalls.js";
import PlusIcon from "../Common/PlusIcon";
import { Table } from "antd"
import { STATUS_COLOR, STATUS_TYPES } from "../../utils/constants.js"
import EditIcon from "../Common/EditIcon";

const Category = () => {
  const [categoryItems, setCategoryItems] = React.useState([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategoryItems(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let className = STATUS_COLOR.ACTIVE;
        if(text === STATUS_TYPES.INACTIVE){
          className = STATUS_COLOR.INACTIVE
        }
        return <div className={`bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded`}>{text}</div>
      },
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (text) => {
        return <EditIcon/ >
      },
    }
  ]

  
  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Category"} pages={["Category"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <div></div>
              <Link
                href="/category/new"
                className="inline-flex items-center gap-2 text-dark hover:text-green transition"
              >
                <PlusIcon />
                <span>Add&nbsp;Category</span>
              </Link>
            </div>
            <Table dataSource={categoryItems} columns={columns} rowKey="id" pagination={false} />
          </div>
        </section>
      
    </>
  );
};

export default Category;
