import MyAccount from "@/components/MyAccount";
import React from "react";

import { Metadata } from "next";
import { PROJECT_DETAILS } from "@/utils/constants";

export const metadata: Metadata = {
  title: `My Account | ${PROJECT_DETAILS.name}`,
  description:
    "View and update your DAMS profile, addresses, and recent orders from one secure hub.",
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
