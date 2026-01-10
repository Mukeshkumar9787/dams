import Home from "@/components/Home";
import { PROJECT_DETAILS } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: PROJECT_DETAILS.name,
  description: PROJECT_DETAILS.description,
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
