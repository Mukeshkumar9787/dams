import React from "react";
import { Metadata } from "next";
import SizeForm from "@/components/Size/Form";
export const metadata: Metadata = {
  title: "Size",
};

const NewPage = async ({params}) => {
  return (
    <>
      <SizeForm params={ await params} />
    </>
  );
};

export default NewPage;
