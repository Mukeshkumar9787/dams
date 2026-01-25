import { Menu } from "@/types/Menu";
import { CATEGORY_URL, COLOR_URL, HSN_URL, PRODUCT_URL, SIZE_URL } from "@/utils/appUrls";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Shop",
    newTab: false,
    path: "/shop",
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/contact",
  },
];

export const adminMenuData: Menu[] = [
    {
    id: 4,
    title: "Manage",
    newTab: false,
    path: "/",
    submenu: [
      {
        id: 5,
        title: "Category",
        newTab: false,
        path: CATEGORY_URL,
      },
      {
        id: 6,
        title: "HSN",
        newTab: false,
        path: HSN_URL,
      },
      {
        id: 7,
        title: "Product",
        newTab: false,
        path: PRODUCT_URL,
      },
      {
        id: 8,
        title: "Size",
        newTab: false,
        path: SIZE_URL,
      },
      {
        id: 9,
        title: "Color",
        newTab: false,
        path: COLOR_URL,
      },
    ],
  }
]
