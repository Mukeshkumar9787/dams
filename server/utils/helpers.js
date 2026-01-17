import fs from "fs";
import path from "path";

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
