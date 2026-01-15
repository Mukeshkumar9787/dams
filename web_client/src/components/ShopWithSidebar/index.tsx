"use client";
import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdown";
import { Button, Pagination } from "antd";
import { getProducts } from "@/http/apiCalls";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Filter from "./Filter";
import { STATUS_TYPES } from "@/utils/constants";
import { Empty } from 'antd';
import { FilterOutlined } from "@ant-design/icons";
import ProductItem from "../Common/ProductItem";


const ShopWithSidebar = () => {
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [productItems, setProductItems] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({ pageNumber: 1, pageSize: 6});
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      const category = params.get('category');
      const size = params.get('size');
      const color = params.get('color');

      const data = await getProducts({
        ...pagination,
        category,
        size,
        color,
        status: STATUS_TYPES.ACTIVE
      });

      setProductItems(data?.data || []);
      setTotalCount(data?.totalCount || 0);
    } catch (err) {
      console.error(err);
    }
  }, [pagination, searchParams]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    // closing sidebar while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const clearFilter = () => {
    router.push(pathname);
  };

  const setCategoryFilter = (category: string) => {
    params.set('category', category.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const setSizeFilter = (size: string) => {
    params.set('size', size.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const setColorFilter = (color: string) => {
    params.set('color', color.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Breadcrumb
        title={"Explore All Products"}
        pages={["shop"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <Filter clearFilter={clearFilter} />

          <div className="flex gap-7.5 mt-5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(prev => !prev)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-40"
                }`}
              >
                <FilterOutlined className="text-3xl" />
              </button>


              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  

                  {/* <!-- category box --> */}
                  <CategoryDropdown setCategoryFilter={setCategoryFilter} />

                  {/* // <!-- size box --> */}
                  <SizeDropdown setSizeFilter={setSizeFilter} />

                  {/* // <!-- color box --> */}
                  <ColorsDropdwon setColorFilter={setColorFilter} />

                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
            {(productItems.length > 0) ?
              <>
              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"}`}
              >
                {productItems.map((item, key) => <ProductItem item={item} key={key} />)}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <Pagination onChange={(page, pageSize) => {setPagination({pageNumber: page, pageSize})}} total={totalCount} pageSize={pagination.pageSize} current={pagination.pageNumber} />
                </div>
              </div>
              {/* <!-- Products Pagination End --> */}
              </>
              :
              <Empty description={
                <div> 
                  <div>No products found</div>
                  <Button onClick={clearFilter} type="dashed"> Clear Filters</Button>
                </div>
              }/>
              }
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
