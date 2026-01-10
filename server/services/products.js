import prisma, { PrismaConfig } from "../prisma/client.js";

import { FEATURE_TYPES } from "../utils/constants.js";
import { convertToFullFilePath, deleteFiles, slugText } from "../utils/helpers.js";
import { fileService } from "./index.js";

/**
 * Create Product
 */
const createProduct = async ({ title, fileIds, deletedFileIds, categoryId, hsnId, mrp, price, stock, status, sizeId, colorId }) => {
  let product = null;

  await prisma.$transaction( async (tx) => {
    product = await tx.Product.create({ data: { title, slug: slugText(title), categoryId, hsnId, mrp, price, stock, status, sizeId, colorId }});
    await fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.PRODUCT, featureId: product.id, fileIds, deletedFileIds })
  })

  return product;
};

/**
 * Get all Products
 */
const getProducts = async ({ status, pageNumber=1, pageSize=10, search='' }) => {
  const conditions = [];

  if (status) {
    conditions.push(PrismaConfig.sql`p.status = ${status}`);
  }
  
  if(search) {
    const searchText = `%${search}%`;
    conditions.push(PrismaConfig.sql`p.title ilike ${searchText}`);
  }

  const whereClause =
    conditions.length
      ? PrismaConfig.sql`WHERE ${PrismaConfig.join(conditions, PrismaConfig.sql` AND `)}`
      : PrismaConfig.empty;
  
  const offset = (pageNumber - 1) * pageSize;

  const [products, totalCount] = await Promise.all([
    prisma.$queryRaw`
      SELECT
        p.id,
        p.title,
        p.status,
        p.slug,
        p.mrp,
        p.price,
        c.title as "categoryName",
        s.title as "sizeName",
        color.code as "colorCode",
        (select f."path"  from "File" f where f.feature = ${FEATURE_TYPES.PRODUCT} and f."featureId" = p."id" order by f."createdAt" asc limit 1) as img
      FROM "Product" p
      LEFT JOIN "Category" c ON c."id" = p."categoryId"
      LEFT JOIN "Size" s ON s."id" = p."sizeId"
      LEFT JOIN "Color" color ON color."id" = p."colorId"
      ${whereClause}
      ORDER BY p."createdAt" DESC
      OFFSET ${offset} LIMIT ${pageSize};
    `,
    prisma.$queryRaw`SELECT COUNT(1) FROM "Product" p ${whereClause}`
  ]);

  return { 
    products: products.map(i => ({ ...i, img: convertToFullFilePath(i.img) })),
    totalCount: parseInt(totalCount[0].count)
  }
};

/**
 * Get single Product
 */
const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: {
      slug
    }
  });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  const images = await prisma.file.findMany({
    select: {
      id: true,
      path: true
    },
    where: {
      feature: FEATURE_TYPES.PRODUCT,
      featureId: product.id
    },
    orderBy: [{ createdAt: 'asc' }]
  });
  product.images = images.map(i => {
    if(i.path){
      i.path = convertToFullFilePath(i.path);
    }
    return i;
  });
  return product;
};

/**
 * Update Product
 */
const updateProduct = async (id, { title, fileIds, deletedFileIds, categoryId, hsnId, mrp, price, stock, status, sizeId, colorId }) => {
  let updated = null;
  let deletedFiles = [];
  
  await prisma.$transaction(async (tx) => {
    let deletedRecords;
    [updated, { deletedRecords }] = await Promise.all([
      tx.Product.update({
        where: { id },
        data: {
          title,
          slug: slugText(title),
          categoryId, hsnId, mrp: parseFloat(mrp), price: parseFloat(price), stock,
          status, sizeId, colorId
        },
      }),
      fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.PRODUCT, featureId: id, fileIds, deletedFileIds })
    ]);
    deletedFiles = deletedRecords;
  })

  if (!updated) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  deleteFiles(deletedFiles.map(i => i.path));
  return updated;
};

/**
 * Soft delete Product
 */
const deleteProduct = async (id) => {
  const deleted = await prisma.Product.delete({
    where: { id },
  });

  if (!deleted) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    id: deleted.id,
  };
};

export default {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
