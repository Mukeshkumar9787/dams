import React from "react";
import ConfigForm from "@/components/Config";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Config",
};

const ConfigPage = () => {
  return (<ConfigForm />);
};

export default ConfigPage;
