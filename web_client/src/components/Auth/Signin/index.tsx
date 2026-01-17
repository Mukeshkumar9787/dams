"use client"
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ModalInfo from "@/components/Common/ModalInfo";
import Link from "next/link";
import { afterSucessfullLogin } from "@/utils/helper";
import { login } from "@/http/apiCalls";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/Common/PasswordInput";
import { getAlertContent, PASSWORD_REGEX } from "@/utils/constants";

const Signin = () => {
  const [alert, setAlert] = useState(null);
  
  const router = useRouter();
  useEffect(() => {
    let next = localStorage.getItem('loginToProceed'); 
    localStorage.removeItem('loginToProceed'); 
    if(next){
      setAlert('loginToProceed');
    }
  },[]);

  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());
      if(!PASSWORD_REGEX.test(values.password.toString())){
        setAlert('regex');
        return
      }
      const response = await login(values);
      if(response.success){
        afterSucessfullLogin(router, response.data.token);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <ModalInfo isOpen={alert} content={getAlertContent(alert)} closable={false} onOk={()=> {setAlert(null)}}  />
      <Breadcrumb title={"Signin"} pages={["Signin"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Sign In to Your Account
              </h2>
              <p>Enter your detail below</p>
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="Enter your email"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password
                  </label>

                  <PasswordInput
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="on"
                    minLength={8}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Sign in to account
                </button>

                <Link
                  href="/signin-otp"
                  className="block text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                >
                  Signin&nbsp;with&nbsp;OTP
                </Link>

                <Link
                  href="/reset-password"
                  className="block text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark"
                >
                  Forget your password?
                </Link>


                <p className="text-center mt-6">
                  Don&apos;t have an account?
                  <Link
                    href="/signup"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                    >
                    Sign Up Now!
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
