import React from "react";
import { Metadata } from "next";
import ProductForm from "@/components/Product/Form";
export const metadata: Metadata = {
  title: "Product",
};

const ProductPage = async ({params}) => {
  return (
    <>
      <ProductForm params={ await params} />
    </>
  );
};

export default ProductPage;
