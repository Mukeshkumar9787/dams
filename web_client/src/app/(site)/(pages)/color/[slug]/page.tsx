import React from "react";
import { Metadata } from "next";
import ColorForm from "@/components/Color/Form";
export const metadata: Metadata = {
  title: "Color",
};

const NewPage = async ({params}) => {
  return (
    <>
      <ColorForm params={ await params} />
    </>
  );
};

export default NewPage;
