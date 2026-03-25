import Contact from "@/components/Contact";

import { Metadata } from "next";
import { PROJECT_DETAILS } from "@/utils/constants";

export const metadata: Metadata = {
  title: `Contact | ${PROJECT_DETAILS.name}`,
  description:
    "Get in touch with the DAMS team for support, collaborations, or wholesale inquiries.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
