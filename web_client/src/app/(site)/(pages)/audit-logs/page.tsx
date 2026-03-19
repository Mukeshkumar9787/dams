import React from "react";
import type { Metadata } from "next";
import AuditLogs from "@/components/AuditLogs";

export const metadata: Metadata = {
  title: "Audit Logs",
};

const AuditLogsPage = () => {
  return <AuditLogs />;
};

export default AuditLogsPage;
