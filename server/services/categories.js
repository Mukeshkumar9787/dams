import prisma from "../prisma/client.js";
import { FEATURE_TYPES } from "../utils/constants.js";
import { convertToFullFilePath, deleteFiles } from "../utils/helpers.js";
import { fileService } from "./index.js";

/**
 * Create category
 */
const createCategory = async ({ title, img, fileIds }) => {
  const exists = await prisma.category.findFirst({
    where: { title, deletedAt: null },
  });

  if (exists) {
    const err = new Error("Category already exists");
    err.statusCode = 400;
    throw err;
  }

  let category = null;

  await prisma.$transaction( async (tx) => {
    category = await tx.category.create({ data: { title }});
    await fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.CATEGORY, featureId: category.id, fileIds })
  })

  return {
    id: category.id,
    title: category.title,
    createdAt: category.createdAt,
  };
};

/**
 * Get all categories (ignoring deleted ones)
 */
const getCategories = async () => {
  const categories = await prisma.$queryRaw`
    select c.id, c.title, c.status, f.path as img
    from "Category" c
    left join "File" f on f."featureId" = c.id and f."deletedAt" is null
    where c."deletedAt" is null
    order by c."createdAt" desc;
  `;
  return categories.map(i => {
    if(i.img){
      i.img = convertToFullFilePath(i.img);
    }
    return i;
  });
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
const updateCategory = async (id, { title, fileIds, deletedFileIds }) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.deletedAt) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

  let updated = null;
  let deletedFiles = [];

  await prisma.$transaction(async (tx) => {
    let deletedRecords;
    [updated, { deletedRecords }] = await Promise.all([
      tx.category.update({
        where: { id },
        data: {
          title: title ?? category.title,
        },
      }),
      fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.CATEGORY, featureId: category.id, fileIds, deletedFileIds })
    ]);
    deletedFiles = deletedRecords;
  })

  deleteFiles(deletedFiles.map(i => i.path));
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
