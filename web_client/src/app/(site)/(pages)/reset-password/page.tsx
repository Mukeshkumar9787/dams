import React from "react";
import { Metadata } from "next";
import ResetPassword from "@/components/Auth/ResetPassword";
export const metadata: Metadata = {
  title: "Reset Password",
  // other metadata
};

const SigninOtpPage = () => {
  return (
    <main>
      <ResetPassword />
    </main>
  );
};

export default SigninOtpPage;
