import React from "react";
import { Metadata } from "next";
import Users from "@/components/Users";
export const metadata: Metadata = {
  title: "Users List",
};

const UsersList = () => {
  return (
    <>
      <Users />
    </>
  );
};

export default UsersList;
