import React from "react";

import { Metadata } from "next";
import Color from "@/components/Color";
export const metadata: Metadata = {
  title: "Color List",
};

const SizePage = () => {
  return (
    <>
      <Color />
    </>
  );
};

export default SizePage;
