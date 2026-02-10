import { Menu } from "@/types/Menu";
import { CATEGORY_URL, COLOR_URL, HSN_URL, ORDER_URL, PRODUCT_URL, SIZE_URL } from "@/utils/appUrls";

export const menuData: Menu[] = [
  {
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    title: "Shop",
    newTab: false,
    path: "/shop",
  },
  {
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
];

export const adminMenuData: Menu[] = [
    {
    title: "Manage",
    newTab: false,
    path: "/",
    submenu: [
      {
        title: "Orders",
        newTab: false,
        path: ORDER_URL,
      },
      {
        title: "Category",
        newTab: false,
        path: CATEGORY_URL,
      },
      {
        title: "HSN",
        newTab: false,
        path: HSN_URL,
      },
      {
        title: "Product",
        newTab: false,
        path: PRODUCT_URL,
      },
      {
        title: "Size",
        newTab: false,
        path: SIZE_URL,
      },
      {
        title: "Color",
        newTab: false,
        path: COLOR_URL,
      },
    ],
  }
]
