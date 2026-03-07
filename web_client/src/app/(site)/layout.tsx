"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { WishlistModalProvider } from "../context/WishlistSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import WishlistSidebarModal from "@/components/Common/WishlistSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import { GoogleOAuthProvider } from '@react-oauth/google';

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import CartSync from "@/components/Common/CartSync";
import WishlistSync from "@/components/Common/WishlistSync";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>

        {loading ? (
          <PreLoader />
        ) : (
          <>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
              <ReduxProvider>
                <CartSync />
                <WishlistSync />
                <CartModalProvider>
                  <WishlistModalProvider>
                    <ModalProvider>
                      <PreviewSliderProvider>
                        <Header />
                        <main className="relative z-10 min-h-[70vh]">
                          {children}
                        </main>

                        <QuickViewModal />
                        <CartSidebarModal />
                        <WishlistSidebarModal />
                        <PreviewSliderModal />
                      </PreviewSliderProvider>
                    </ModalProvider>
                  </WishlistModalProvider>
                </CartModalProvider>
              </ReduxProvider>
            </GoogleOAuthProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
