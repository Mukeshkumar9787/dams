import prisma from "../prisma/client.js";
import { FEATURE_TYPES } from "../utils/constants.js";
import { convertToFullFilePath, deleteFiles, slugText } from "../utils/helpers.js";
import { fileService } from "./index.js";

/**
 * Create category
 */
const createCategory = async ({ title, fileIds }) => {
  let category = null;

  await prisma.$transaction( async (tx) => {
    category = await tx.category.create({ data: { title, slug: slugText(title) }});
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
    select c.id, c.title, c.status, c.slug, f.path as img
    from "Category" c
    left join "File" f on f."featureId" = c.id and f."deletedAt" is null
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
const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({ where: { slug } });

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
          slug: title ?? slugText(title)
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
  const deleted = await prisma.category.delete({
    where: { id },
  });

  return {
    id: deleted.id,
  };
};

export default {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
