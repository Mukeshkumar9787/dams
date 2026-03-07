import prisma from "../prisma/client.js";
import productService from "./products.js";

const getCartByUserId = async (userId) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }],
  });

  return cartItems.map((item) => ({
    id: item.productId,
    quantity: item.quantity,
  }));
};

const replaceCartByUserId = async (userId, items = []) => {
  const normalized = [];
  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);

    if (!Number.isInteger(productId) || productId <= 0) continue;
    if (!Number.isInteger(quantity) || quantity <= 0) continue;

    const product = await productService.getProductById({ id: productId });
    if (!product || product.stock <= 0) continue;

    const cappedQty = Math.min(quantity, product.stock);
    normalized.push({ productId, quantity: cappedQty });
  }

  const deduped = new Map();
  normalized.forEach((item) => {
    deduped.set(item.productId, item.quantity);
  });

  const finalItems = Array.from(deduped.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { userId } });
    if (finalItems.length) {
      await tx.cartItem.createMany({
        data: finalItems.map((item) => ({ ...item, userId })),
      });
    }
  });

  return finalItems.map((item) => ({ id: item.productId, quantity: item.quantity }));
};

export default {
  getCartByUserId,
  replaceCartByUserId,
};
