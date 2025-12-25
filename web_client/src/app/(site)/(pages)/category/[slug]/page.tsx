import React from "react";
import { Metadata } from "next";
import CategoryForm from "@/components/Category/Form";
export const metadata: Metadata = {
  title: "New Category",
};

const NewCategoryPage = async ({params}) => {
  return (
    <>
      <CategoryForm params={ await params} />
    </>
  );
};

export default NewCategoryPage;
