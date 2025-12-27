import React from "react";
import Hsn from "@/components/Hsn";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hsn List",
};

const HsnPage = () => {
  return (
    <>
      <Hsn />
    </>
  );
};

export default HsnPage;
