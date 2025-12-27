import React from "react";
import { Metadata } from "next";
import HsnForm from "@/components/Hsn/Form";
export const metadata: Metadata = {
  title: "HSN",
};

const NewHsnPage = async ({params}) => {
  return (
    <>
      <HsnForm params={ await params} />
    </>
  );
};

export default NewHsnPage;
