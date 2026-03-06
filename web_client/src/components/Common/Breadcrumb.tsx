import Link from "next/link";
import React from "react";

const PATH_BY_LABEL = {
  "shop": "/shop",
  "shop details": "/shop-details",
  "shop without sidebar": "/shop-without-sidebar",
  "checkout": "/checkout",
  "cart": "/cart",
  "wishlist": "/wishlist",
  "my account": "/my-account",
  "signin": "/signin",
  "signin with otp": "/signin-otp",
  "signup": "/signup",
  "reset password": "/reset-password",
  "contact": "/contact",
  "order": "/orders",
  "orders": "/orders",
  "users": "/users",
  "config": "/config",
  "product": "/product",
  "category": "/category",
  "color": "/color",
  "size": "/size",
  "hsn": "/hsn",
  "error": "/error",
  "mailsuccess": "/mail-success",
  "blog grid": "/blogs/blog-grid",
  "blog grid sidebar": "/blogs/blog-grid-with-sidebar",
  "blog details": "/blogs/blog-details",
  "blog details sidebar": "/blogs/blog-details-with-sidebar",
};

const normalizeLabel = (value) => (value || "").toString().replaceAll("/", "").trim();

const getHrefForLabel = (label) => {
  const normalized = normalizeLabel(label).toLowerCase();
  if (!normalized) return "";
  if (PATH_BY_LABEL[normalized]) return PATH_BY_LABEL[normalized];
  return `/${normalized.replace(/\s+/g, "-")}`;
};

const Breadcrumb = ({ title, pages }) => {
  const breadcrumbPages = (pages || [])
    .map((page) => {
      if (typeof page === "string") {
        return { label: normalizeLabel(page), href: getHrefForLabel(page) };
      }
      return {
        label: normalizeLabel(page?.label || ""),
        href: page?.href || getHrefForLabel(page?.label || ""),
      };
    })
    .filter((page) => page.label);

  return (
    <div className="overflow-hidden border-b border-gray-3/60 bg-white/70">
      <div>
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-8">
          <div className="surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <h1 className="font-semibold text-dark text-xl sm:text-2xl">
              {title}
            </h1>

            <ul className="flex items-center gap-2 text-custom-sm flex-wrap">
              <li className="text-dark-4 hover:text-blue">
                <Link href="/">Home</Link>
              </li>
              {breadcrumbPages.map((page, key) => {
                const isLast = key === breadcrumbPages.length - 1;
                return (
                  <React.Fragment key={`${page.label}-${key}`}>
                    <li className="text-dark-4">/</li>
                    <li className={`capitalize ${isLast ? "text-blue" : "text-dark-4 hover:text-blue"}`}>
                      {!isLast ? <Link href={page.href}>{page.label}</Link> : page.label}
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
