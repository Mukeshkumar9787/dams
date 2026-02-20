"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { getConfig } from "@/http/apiCalls";
import { CONFIG_KEYS } from "@/utils/constants";

const Contact = () => {
  const [compInfo, setCompInfo] = React.useState({});

  const fetchConfig = React.useCallback(async () => {
    try {
      const { success, data } = await getConfig();
      if (!success) return;

      setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <>
      <Breadcrumb title="Contact" pages={["contact"]} />

      <section className="py-20 bg-gray-100">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">

          {/* LEFT & RIGHT LAYOUT */}
          <div className="flex flex-col xl:flex-row gap-10">

            {/* LEFT SIDE - CONTACT INFO */}
            <div className="xl:w-1/2 w-full bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Contact Information
              </h2>

              <div className="flex flex-col gap-6 text-lg">

                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {compInfo?.email || "Loading..."}
                </p>

                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {compInfo?.mobile || "Loading..."}
                </p>

                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {compInfo?.address || "Loading..."}
                </p>

              </div>
            </div>

            {/* RIGHT SIDE - GOOGLE MAP */}
            <div className="xl:w-1/2 w-full">
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
                <iframe
                  title="google-map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.1284225170953!2d77.37476937590091!3d11.103805453068034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907001591418b%3A0xe7e5829e7d28960e!2sDAMS%203D%20PRINTING!5e0!3m2!1sen!2sin!4v1771604589585!5m2!1sen!2sin"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;