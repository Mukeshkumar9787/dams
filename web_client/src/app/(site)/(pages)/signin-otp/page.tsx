import React from "react";
import { Metadata } from "next";
import SigninOtp from "@/components/Auth/SignInOtp";
export const metadata: Metadata = {
  title: "SigninOtp",
  // other metadata
};

const SigninOtpPage = () => {
  return (
    <main>
      <SigninOtp />
    </main>
  );
};

export default SigninOtpPage;
