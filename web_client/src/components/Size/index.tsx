"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { getSizes } from "../../http/apiCalls.js";
import PlusIcon from "../Common/PlusIcon";
import { Table } from "antd"
import { STATUS_COLOR, STATUS_TYPES } from "../../utils/constants.js"
import EditIcon from "../Common/EditIcon";
import { SIZE_NEW_URL, SIZE_URL } from "@/utils/appUrls";

const Size = () => {
  const [sizeItems, setSizeItems] = React.useState([]);

  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getSizes();
        setSizeItems(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItems();
  }, []);

  const columns = [
    {
      title: 'Size',
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
        return (
          <div className="w-full flex flex-row">
            <div className={`w-1/2 bg-${className} text-white px-4 py-2 rounded`}>{text}</div>
          </div> )
      },
    },
    {
      title: 'Action',
      dataIndex: 'title',
      key: 'action',
      render: (title) => {
        return(
          <>
            <Link
                  href={SIZE_URL + `/${title}`}
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
        <Breadcrumb title={"Size"} pages={["Size"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <div></div>
              <Link
                href={SIZE_NEW_URL}
                className="inline-flex items-center gap-2 text-dark hover:text-green transition"
              >
                <PlusIcon />
                <span>Add&nbsp;Size</span>
              </Link>
            </div>
            <Table dataSource={sizeItems} columns={columns} rowKey="id" pagination={false} />
          </div>
        </section>
      
    </>
  );
};

export default Size;
