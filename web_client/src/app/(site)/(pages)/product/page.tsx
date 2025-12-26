import React from "react";
import Product from "@/components/Product";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Product List",
};

const ProductList = () => {
  return (
    <>
      <Product />
    </>
  );
};

export default ProductList;
