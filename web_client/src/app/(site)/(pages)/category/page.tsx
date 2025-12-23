import React from "react";
import Category from "@/components/Category";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Category List",
};

const CategoryPage = () => {
  return (
    <>
      <Category />
    </>
  );
};

export default CategoryPage;
