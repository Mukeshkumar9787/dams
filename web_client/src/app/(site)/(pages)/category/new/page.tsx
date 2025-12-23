import React from "react";
import { Metadata } from "next";
import CategoryForm from "@/components/Category/Form";
export const metadata: Metadata = {
  title: "New Category",
};

const NewCategoryPage = () => {
  return (
    <>
      <CategoryForm />
    </>
  );
};

export default NewCategoryPage;
