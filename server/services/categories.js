import prisma from "../prisma/client.js";

/**
 * Create category
 */
const createCategory = async ({ title, img }) => {
  const exists = await prisma.category.findFirst({
    where: { title, deletedAt: null },
  });

  if (exists) {
    const err = new Error("Category already exists");
    err.statusCode = 400;
    throw err;
  }

  const category = await prisma.category.create({
    data: {
      title,
      img,
    },
  });

  return {
    id: category.id,
    title: category.title,
    img: category.img,
    createdAt: category.createdAt,
  };
};

/**
 * Get all categories (ignoring deleted ones)
 */
const getCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return categories;
};

/**
 * Get single category
 */
const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.deletedAt) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  return category;
};

/**
 * Update category
 */
const updateCategory = async (id, { title, img }) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.deletedAt) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      title: title ?? category.title,
      img: img ?? category.img,
    },
  });

  return updated;
};

/**
 * Soft delete category
 */
const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.deletedAt) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  const deleted = await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return {
    id: deleted.id,
  };
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
