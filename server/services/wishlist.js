import prisma from "../prisma/client.js";
import productService from "./products.js";

const getWishlistByUserId = async (userId) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
  });
  return items.map((item) => ({ id: item.productId }));
};

const replaceWishlistByUserId = async (userId, items = []) => {
  const uniqueProductIds = [...new Set(items.map((id) => Number(id)))]
    .filter((id) => Number.isInteger(id) && id > 0);

  const validProductIds = [];
  for (const productId of uniqueProductIds) {
    const product = await productService.getProductById({ id: productId });
    if (product) validProductIds.push(productId);
  }

  await prisma.$transaction(async (tx) => {
    await tx.wishlistItem.deleteMany({ where: { userId } });
    if (validProductIds.length) {
      await tx.wishlistItem.createMany({
        data: validProductIds.map((productId) => ({ userId, productId })),
      });
    }
  });

  return validProductIds.map((id) => ({ id }));
};

export default {
  getWishlistByUserId,
  replaceWishlistByUserId,
};
