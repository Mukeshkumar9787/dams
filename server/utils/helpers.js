import fs from "fs";
import path from "path";
import { generateRandom } from "./cryptoUtils.js";

export const toCamelCase = (row) => {
  const obj = {};
  for (const key in row) {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    obj[camelKey] = row[key];
  }
  return obj;
};

export const convertToFullFilePath = (filePath) => process.env.SERVER_ADDRESS + filePath;

export const deleteFile = async(filePath) => {
  const fileFullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fileFullPath)) {
    fs.unlinkSync(fileFullPath);
  }
}

export const deleteFiles = (files) => {
  return Promise.all([
    files.map(file => deleteFile(file))
  ])
};

export const slugText = (text) => {
  return text.replace(/\s+/g, '-');
}

export const OTP_EXPIRY_MINUTES = 5 * 60 * 1000;

export function isOtpExpired(createdAt) {
  return (Date.now() - createdAt.getTime()) > OTP_EXPIRY_MINUTES;
}

export const getFullAddress = (address, isBilling=false) => {
  if(isBilling){
    return `${address.billingName},${address.billingMobile},${address.billingAddress}, ${address.billingCity}, ${address.billingState}, ${address.billingCountry} - ${address.billingPincode}`
  }
  return `${address.name},${address.mobile},${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`
}

export const generateOrderNo = (userId) => {
  const date = new Date();
  const random = generateRandom();
  const formatted = String(userId) + date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0') +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0') +
        String(date.getSeconds()).padStart(2, '0') +
        String(date.getMilliseconds()).padStart(3, '0') +
        String(random);
  return formatted;
}