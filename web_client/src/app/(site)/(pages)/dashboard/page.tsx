import React from "react";
import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
