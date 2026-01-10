import React from "react";

import { Metadata } from "next";
import Size from "@/components/Size";
export const metadata: Metadata = {
  title: "Size List",
};

const SizePage = () => {
  return (
    <>
      <Size />
    </>
  );
};

export default SizePage;
