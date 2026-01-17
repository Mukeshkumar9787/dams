"use client"
import React, { useRef, useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { register } from "@/http/apiCalls";
import { getAlertContent, PASSWORD_MIN_LENGTH, PASSWORD_REGEX, VERIFY_OTP_TYPES } from "@/utils/constants";
import Link from "next/link";
import VerifyOTP from "../VerifyOTP";
import ModalInfo from "@/components/Common/ModalInfo";
import PasswordInput from "@/components/Common/PasswordInput";

const Signup = () => {
  const [alert, setAlert] = useState(null);
  const [enterOTP, setEnterOTP] = useState(false);
  const emailRef = useRef('');

  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const values = Object.fromEntries(formData.entries());

      if(!PASSWORD_REGEX.test(values.password)){
        setAlert('regex');
        return
      }
      
      if (values.password !== values.confirmPassword) {
        setAlert('confirmPassword');
        return;
      }
      
      const response = await register(values);
      if(response.success){
        setEnterOTP(true);
        emailRef.current = values.email.toString();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onOTPVerificationClose = () => {
    setEnterOTP(false);
    emailRef.current = '';
  }

  const resendOtp = () => {
    const form = document.getElementById("sign-up") as HTMLFormElement;
    form?.requestSubmit(); // ✅ triggers handleSubmit
  }
  

  return (
    <>
      <ModalInfo isOpen={alert} content={getAlertContent(alert)} onClose={()=> {setAlert(null)}} onOk={()=> {setAlert(null)}}  />
      <VerifyOTP isOpen={enterOTP} sentTo={emailRef.current} 
      onClose={onOTPVerificationClose} type={VERIFY_OTP_TYPES.REGISTER} resendOtp={resendOtp} />
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your detail below</p>
            </div>
            <div className="mt-5.5">
              <form id="sign-up" onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Full Name <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Enter your full name"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="Enter your email address"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="mobile" className="block mb-2.5">
                    Mobile <span className="text-red">*</span>
                  </label>

                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    required
                    placeholder="Enter your mobile"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>

                  <PasswordInput
                    type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="Enter your password"
                    autoComplete="on"
                    minLength={PASSWORD_MIN_LENGTH}
                    title="At least 6 characters, one uppercase letter, and one number"
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5.5">
                  <label htmlFor="re-type-password" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>

                  <PasswordInput
                    type="password"
                    name="confirmPassword"
                    id="re-type-password"
                    required
                    placeholder="Re-type your password"
                    autoComplete="on"
                    minLength={PASSWORD_MIN_LENGTH}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  Create Account
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    Sign in Now
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

export default Signup;
