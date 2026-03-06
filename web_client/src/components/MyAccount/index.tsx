"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Orders from "../Orders";
import { getLoggedInUserData, getMemberSince, logout } from "@/utils/helper";
import { updateProfile } from "@/http/apiCalls";
import { Button, Popconfirm } from "antd";
import ResetPassword from "../Auth/ResetPassword";
import Addresses from "./Addresses";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState({});
  const tabs = [
    { key: "orders", label: "Orders" },
    { key: "addresses", label: "Addresses" },
    { key: "account-details", label: "Profile" },
    { key: "reset-password", label: "Reset Password" },
  ];

  
  useEffect(()=>{
    if(!localStorage.getItem('token')) {
      window.location.href = '/';
      return
    };
    const fetchUser = async() => {
      const userData = await getLoggedInUserData();
      setUser(userData);
    }
    fetchUser();
  },[])

  const handleProfileUpdate = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      const response = await updateProfile(values);
      window.alert(response.message);
      window.location.reload();
    } catch (error) {
      
    }
  }

  return (
    <>
      <Breadcrumb title={"My Account"} pages={["my account"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col gap-7.5">
            {/* <!--== user dashboard menu start ==--> */}
            <div className="w-full bg-white rounded-xl shadow-1">
              <div className="flex flex-col">
                
                <div className="flex flex-wrap items-center gap-5 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  
                  <div className="max-w-[64px] w-full h-16 rounded-full overflow-hidden">
                    <Image
                      src="/images/icons/icon-08.svg"
                      alt="user"
                      width={64}
                      height={64}
                    />
                  </div>

                  <div>
                    <p className="font-medium text-dark mb-0.5">
                      {user.name}
                    </p>
                    <p className="text-custom-xs">Member Since {getMemberSince(user.createdAt)}</p>
                    <Popconfirm title="Logout ?" okType="primary" okButtonProps={{className: "bg-blue text-white"}} onConfirm={logout}>
                    <Button
                      className={`flex items-center rounded-md gap-1 py-1 px-2 ease-out duration-200 bg-red text-white hover:bg-dark hover:text-white ${
                        activeTab === "logout"
                          ? "text-white bg-blue"
                          : "text-dark-2 bg-gray-1"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7005 1.14581C12.4469 1.14579 11.4365 1.14578 10.6417 1.25263C9.81664 1.36356 9.12193 1.60088 8.57017 2.15263C8.08898 2.63382 7.84585 3.22514 7.71822 3.91997C7.59419 4.59515 7.57047 5.42142 7.56495 6.41282C7.56284 6.79251 7.86892 7.10202 8.24861 7.10414C8.6283 7.10625 8.93782 6.80016 8.93993 6.42047C8.94551 5.4181 8.97154 4.70761 9.07059 4.16838C9.16603 3.64881 9.31927 3.34807 9.54244 3.12491C9.79614 2.87121 10.1523 2.7058 10.825 2.61537C11.5174 2.52227 12.435 2.52081 13.7508 2.52081H14.6675C15.9833 2.52081 16.901 2.52227 17.5934 2.61537C18.266 2.7058 18.6222 2.87121 18.8759 3.12491C19.1296 3.37861 19.295 3.7348 19.3855 4.40742C19.4786 5.09983 19.48 6.01752 19.48 7.33331V14.6666C19.48 15.9824 19.4786 16.9001 19.3855 17.5925C19.295 18.2652 19.1296 18.6214 18.8759 18.8751C18.6222 19.1288 18.266 19.2942 17.5934 19.3846C16.901 19.4777 15.9833 19.4791 14.6675 19.4791H13.7508C12.435 19.4791 11.5174 19.4777 10.825 19.3846C10.1523 19.2942 9.79614 19.1288 9.54244 18.8751C9.31927 18.6519 9.16603 18.3512 9.07059 17.8316C8.97154 17.2924 8.94551 16.5819 8.93993 15.5795C8.93782 15.1998 8.6283 14.8937 8.24861 14.8958C7.86892 14.8979 7.56284 15.2075 7.56495 15.5871C7.57047 16.5785 7.59419 17.4048 7.71822 18.08C7.84585 18.7748 8.08898 19.3661 8.57017 19.8473C9.12193 20.3991 9.81664 20.6364 10.6417 20.7473C11.4365 20.8542 12.4469 20.8542 13.7006 20.8541H14.7178C15.9714 20.8542 16.9819 20.8542 17.7766 20.7473C18.6017 20.6364 19.2964 20.3991 19.8482 19.8473C20.4 19.2956 20.6373 18.6009 20.7482 17.7758C20.855 16.981 20.855 15.9706 20.855 14.7169V7.28302C20.855 6.02939 20.855 5.01893 20.7482 4.22421C20.6373 3.39911 20.4 2.70439 19.8482 2.15263C19.2964 1.60088 18.6017 1.36356 17.7766 1.25263C16.9819 1.14578 15.9714 1.14579 14.7178 1.14581H13.7005Z"
                          fill=""
                        />
                        <path
                          d="M13.7507 10.3125C14.1303 10.3125 14.4382 10.6203 14.4382 11C14.4382 11.3797 14.1303 11.6875 13.7507 11.6875H3.69247L5.48974 13.228C5.77802 13.4751 5.81141 13.9091 5.56431 14.1974C5.3172 14.4857 4.88318 14.5191 4.5949 14.272L1.38657 11.522C1.23418 11.3914 1.14648 11.2007 1.14648 11C1.14648 10.7993 1.23418 10.6086 1.38657 10.478L4.5949 7.72799C4.88318 7.48089 5.3172 7.51428 5.56431 7.80256C5.81141 8.09085 5.77802 8.52487 5.48974 8.77197L3.69247 10.3125H13.7507Z"
                          fill=""
                        />
                      </svg>
                      Logout
                    </Button>
                    </Popconfirm>
                  </div>

                  
                </div>

                <div className="p-4 sm:p-7.5 xl:p-9">
                  
                  <div className="w-full overflow-x-auto">
                    <div className="inline-flex min-w-full rounded-lg bg-gray-1 p-1.5 gap-1.5">
                      {tabs.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`whitespace-nowrap rounded-md py-2.5 px-4 text-sm font-medium ease-out duration-200 ${
                            activeTab === tab.key
                              ? "bg-blue text-white shadow-sm"
                              : "text-dark-2 hover:bg-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--== user dashboard menu end ==-->

            
          <!--== user dashboard content start ==--> */}
            {/* <!-- dashboard tab content start --> */}

            {/* <!-- dashboard tab content end -->

          <!-- orders tab content start --> */}
            <div
              className={`w-full rounded-xl shadow-1 ${
                activeTab === "orders" ? "block" : "hidden"
              }`}
            >
              <Orders />
            </div>
            {/* <!-- orders tab content end -->
          <!-- details tab content start --> */}
            <div
              className={`w-full ${
                activeTab === "addresses" ? "block" : "hidden"
              }`}
            >
              <Addresses />
            </div>
            <div
              className={`w-full ${
                activeTab === "account-details" ? "block" : "hidden"
              } flex justify-center`}
            >
              <form onSubmit={handleProfileUpdate} className="w-full md:w-1/2">
                <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="email" className="block mb-2.5">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={user?.email || ""}
                        disabled
                        readOnly
                        className="rounded-md border border-gray-3 bg-gray-2 text-dark-4 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="firstName" className="block mb-2.5">
                        Name <span className="text-red">*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter Name"
                        defaultValue={user?.name}
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="firstName" className="block mb-2.5">
                        Mobile <span className="text-red">*</span>
                      </label>

                      <input
                        type="number"
                        name="mobile"
                        id="name"
                        placeholder="Enter Mobile"
                        defaultValue={user?.mobile}
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Save Changes
                  </button>
                </div>

                <p className="text-custom-sm mt-5 mb-9">
                  This will be how your name will be displayed in the account
                  section and in reviews
                </p>
              </form>
            </div>
            <div
              className={`w-full ${
                activeTab === "reset-password" ? "block" : "hidden"
              }`}
            >
              <ResetPassword email={user.email} nestedForm />

            </div>
            {/* <!-- details tab content end -->
          <!--== user dashboard content end ==--> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
