"use client";
import React, { useState, useEffect, useCallback } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CategoryDropdown from "./CategoryDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import { Pagination } from "antd";
import { getProducts } from "@/http/apiCalls";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Filter from "./Filter";

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
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button className="text-blue" onClick={clearFilter}>Clean All</button>
                    </div>
                    <Filter />
                  </div>

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

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"}`}
              >
                {productItems.map((item, key) => <SingleGridItem item={item} key={key} />)}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex justify-center mt-15">
                <div className="bg-white shadow-1 rounded-md p-2">
                  <Pagination onChange={(page, pageSize) => {setPagination({pageNumber: page, pageSize})}} total={totalCount} pageSize={pagination.pageSize} current={pagination.pageNumber} />
                </div>
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
