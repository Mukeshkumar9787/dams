import prisma, { PrismaConfig } from "../prisma/client.js";

import { FEATURE_TYPES } from "../utils/constants.js";
import { convertToFullFilePath, deleteFiles, slugText } from "../utils/helpers.js";
import { fileService } from "./index.js";

/**
 * Create category
 */
const createCategory = async ({ title, fileIds, status, deletedFileIds }) => {
  let category = null;

  await prisma.$transaction( async (tx) => {
    category = await tx.category.create({ data: { title, slug: slugText(title), status }});
    await fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.CATEGORY, featureId: category.id, fileIds, deletedFileIds })
  })

  return {
    id: category.id,
    title: category.title,
    createdAt: category.createdAt,
  };
};

/**
 * Get all categories
 */
const getCategories = async ({ status }) => {
  const conditions = [];

  if (status) {
    conditions.push(PrismaConfig.sql`c.status = ${status}`);
  }

  const whereClause =
    conditions.length
      ? PrismaConfig.sql`WHERE ${PrismaConfig.join(conditions, PrismaConfig.sql` AND `)}`
      : PrismaConfig.empty;

  const categories = await prisma.$queryRaw`
    SELECT
      c.id,
      c.title,
      c.status,
      c.slug,
      f.path AS img
    FROM "Category" c
    LEFT JOIN "File" f ON f."featureId" = c.id
    ${whereClause}
    ORDER BY c."createdAt" DESC;
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
  const categories = await prisma.$queryRaw`
    select c.id, c.title, c.status, c.slug, f.path as img, f.id as "fileId"
    from "Category" c
    left join "File" f on f."featureId" = c.id
    where c.slug = ${slug}
    order by c."createdAt" desc;
  `;
  if (categories.length === 0) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }
  let category = categories[0]; 
  category.img = convertToFullFilePath(category.img);
  return category;
};

/**
 * Update category
 */
const updateCategory = async (id, { title, fileIds, deletedFileIds, status }) => {
  let updated = null;
  let deletedFiles = [];

  await prisma.$transaction(async (tx) => {
    let deletedRecords;
    [updated, { deletedRecords }] = await Promise.all([
      tx.category.update({
        where: { id },
        data: {
          title,
          slug: slugText(title),
          status
        },
      }),
      fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.CATEGORY, featureId: id, fileIds, deletedFileIds })
    ]);
    deletedFiles = deletedRecords;
  })

  if (!updated) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

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

  if (!deleted) {
    const err = new Error("Category not found");
    err.statusCode = 404;
    throw err;
  }

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
