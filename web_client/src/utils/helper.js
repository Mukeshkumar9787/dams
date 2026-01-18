import { getUserInfo } from "@/http/apiCalls";

export function getContrastTextColor(hexColor) {
  // Remove #
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Convert to linear RGB
  const toLinear = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) +
    0.7152 * toLinear(g) +
    0.0722 * toLinear(b);

  // WCAG recommended threshold
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export const getCurrencyDetails = () => {
  return {
    currencyName: "Indian Rupee",
    isoCode: "INR",
    currencyCode: "Rs",
    currencySymbol: "₹"
  }
}

export const getProductCountFromCart = (id, cartItems) => cartItems.find(i => i.id === id)?.quantity || 0;

export const getLoggedInUserData = async () => {
  try {
    const user = await getUserInfo();
    return user.data || null;
  } catch (error) {
    return null;
  } 
}

export const afterSucessfullLogin = (router, token) => {
  localStorage.setItem("token", token);
  const next = localStorage.getItem('next'); 
  router.push(next ? next : '/');
  localStorage.removeItem('next');
}

export const getOfferPercent = (mrp, price) => {
  if (!mrp || mrp <= 0) return 0;
  if (price >= mrp) return 0;

  const discount = mrp - price;
  const percent = (discount / mrp) * 100;

  return Math.round(percent); // or Math.floor / Math.ceil
};
