import prisma, { PrismaConfig } from "../prisma/client.js";

import { ERR_CODES, FEATURE_TYPES, STOCK_TYPES } from "../utils/constants.js";
import { convertToFullFilePath, deleteFiles, slugText } from "../utils/helpers.js";
import { sendMail } from "../utils/mailUtils.js";
import { fileService } from "./index.js";

/**
 * Create Product
 */
const createProduct = async ({ title, fileIds, deletedFileIds, categoryId, hsnId, mrp, price, stock, status, sizeId, colorId, variant }) => {
  let product = null;

  await prisma.$transaction( async (tx) => {
    product = await tx.Product.create({ data: { title, slug: slugText(title), categoryId, hsnId, mrp, price, status, sizeId, colorId, variant }});
    await tx.stock.create({ data: { type: STOCK_TYPES.PRODUCT, productId: product.id, quantity: stock } })
    await fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.PRODUCT, featureId: product.id, fileIds, deletedFileIds })
  })

  return product;
};

/**
 * Get all Products
 */
const getProducts = async ({ status, pageNumber=1, pageSize=10, search='', color, category, size, 'productIds[]': productIds = null, pagination = true, variant }) => {
  const conditions = [];

  if (productIds) {
    if(typeof(productIds) === 'string'){
      conditions.push(PrismaConfig.sql`p.id = ${productIds}`);
    }else{
      let productIdSql = productIds.map(id => PrismaConfig.sql`${id}`)
      conditions.push(PrismaConfig.sql`p.id in (${PrismaConfig.join(productIdSql,`,`)})`);
    }
  }

  if (status) {
    conditions.push(PrismaConfig.sql`p.status = ${status}`);
  }

  if (color) {
    conditions.push(PrismaConfig.sql`color.code = ${color}`);
  }

  if (category) {
    conditions.push(PrismaConfig.sql`c.slug = ${category}`);
  }

  
  if (size) {
    conditions.push(PrismaConfig.sql`s.title = ${size}`);
  }
  
  if (variant) {
    conditions.push(PrismaConfig.sql`p.variant = ${variant}`);
  }
  
  if(search) {
    const searchText = `%${search}%`;
    conditions.push(PrismaConfig.sql`p.title ilike ${searchText}`);
  }

  const whereClause =
    conditions.length
      ? PrismaConfig.sql`WHERE ${PrismaConfig.join(conditions,` AND `)}`
      : PrismaConfig.empty;
  
  const offset = (pageNumber - 1) * pageSize;

  let paginationClause = PrismaConfig.empty;
  if(pagination){
    paginationClause = PrismaConfig.sql`OFFSET ${offset} LIMIT ${pageSize}`;
  }

  const [products, totalCount] = await Promise.all([
    prisma.$queryRaw`
      SELECT
        p.id,
        p.title,
        p.status,
        p.slug,
        p.mrp,
        p.price,
        p.variant,
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
      ${paginationClause} ;
    `,
    pagination 
    ? 
    prisma.$queryRaw`
      SELECT COUNT(1)
      FROM "Product" p 
      LEFT JOIN "Category" c ON c."id" = p."categoryId"
      LEFT JOIN "Size" s ON s."id" = p."sizeId"
      LEFT JOIN "Color" color ON color."id" = p."colorId"
      ${whereClause}
    `
    : [{ count: 0 }]
  ]);
  const finalProducts = await Promise.all(products.map(async i => 
    ({...i, 
      img: convertToFullFilePath(i.img), 
      stock: await getProductStockById({ productId: i.id})
    })));
  return { 
    products: finalProducts,
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
    },
    include: {
      Color: {
        select: {
          code: true
        }
      },
      Size: {
        select: {
          title: true
        }
      }
    }
  });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  const [stockQty, images] = await Promise.all([
      getProductStockById({ productId: product.id}),
      prisma.file.findMany({
      select: {
        id: true,
        path: true
      },
      where: {
        feature: FEATURE_TYPES.PRODUCT,
        featureId: product.id
      },
      orderBy: [{ createdAt: 'asc' }]
    })
  ]);
  product.images = images.map(i => {
    if(i.path){
      i.path = convertToFullFilePath(i.path);
    }
    return i;
  });
  product.colorCode = product.Color.code;
  product.sizeTitle = product.Size.title;
  product.stock = stockQty;
  product.Color = undefined;
  product.Size = undefined;
  return product;
};

/**
 * Update Product
 */
const updateProduct = async (id, { title, fileIds, deletedFileIds, categoryId, hsnId, mrp, price, stock, status, sizeId, colorId, variant, oldStockQty }) => {
  let updated = null;
  let deletedFiles = [];
  let shouldSendRestockNotification = false;
  let restockProductInfo = null;
  
  
  await prisma.$transaction(async (tx) => {
    const dbStockQty = await getProductStockById({ productId: id, tx });
    if(dbStockQty !== oldStockQty){
      const err = new Error(`Current Stock changed ${oldStockQty} to ${dbStockQty}. Stock resetted to current stock, Please check and Change it again...!`);
      err.statusCode = 400;
      err.code = ERR_CODES.STOCK_CHANGED;
      err.data = { currentStockQty : dbStockQty };
      throw err;
    }
    let deletedRecords;
    const promises = [
      tx.Product.update({
        where: { id },
        data: {
          title,
          slug: slugText(title),
          categoryId, hsnId, mrp: parseFloat(mrp), price: parseFloat(price),
          status, sizeId, colorId, variant
        },
      }),
      fileService.updateFilesByIds({ tx, feature: FEATURE_TYPES.PRODUCT, featureId: id, fileIds, deletedFileIds })
    ];
    if(dbStockQty !== stock) {
      promises.push(
        tx.stock.create({ data: { type: STOCK_TYPES.PRODUCT, productId: id, quantity: stock - dbStockQty } }),
      )
    }
    [updated, { deletedRecords }] = await Promise.all(promises);
    if (!updated) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      err.data = {stockQty: dbStockQty}
      throw err;
    }
    shouldSendRestockNotification = dbStockQty <= 0 && Number(stock) > 0;
    restockProductInfo = shouldSendRestockNotification ? { id: updated.id, title: updated.title, slug: updated.slug } : null;
    deletedFiles = deletedRecords;
  })
  deleteFiles(deletedFiles.map(i => i.path));
  if (shouldSendRestockNotification && restockProductInfo) {
    sendRestockNotifications(restockProductInfo);
  }
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

const getProductStockById = async({ productId, tx = prisma }) => {
  const productStock = await tx.$queryRaw`
      SELECT COALESCE(SUM(COALESCE(quantity, 0)), 0) as stock
      FROM "Stock"
      WHERE
        "productId" = ${productId}
        AND 
        type NOT IN (${STOCK_TYPES.PAYMENT_PENDING}, ${STOCK_TYPES.WITHDRAW})
        OR (
          type = ${STOCK_TYPES.PAYMENT_PENDING}
          AND "createdAt" > NOW() - INTERVAL '5 minutes'
        )
    `;
  return parseInt(productStock[0].stock)
}

const getProductById = async({ id, tx = prisma, include= null }) => {
  const [product, stock ] = await Promise.all([
    tx.product.findUnique({
      include: include || undefined,
      where: { id }
    }),
    getProductStockById({ productId: id, tx })
  ])
  if(!product) return null
  return { ...product, stock }
}

const subscribeProductRestockNotification = async ({ productId, user }) => {
  const product = await getProductById({ id: productId });
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  if (product.stock > 0) {
    return { alreadyAvailable: true, message: "Product is already in stock." };
  }

  await prisma.productNotification.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
    update: {
      email: user.email,
      notified: false,
      notifiedAt: null,
    },
    create: {
      userId: user.id,
      productId,
      email: user.email,
      notified: false,
    },
  });

  return { message: "You will be notified when this product is back in stock." };
};

const sendRestockNotifications = async ({ id, title, slug }) => {
  const subscriptions = await prisma.productNotification.findMany({
    where: {
      productId: id,
      notified: false,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const image = await prisma.file.findFirst({
    where: {
      feature: FEATURE_TYPES.PRODUCT,
      featureId: id,
    },
    orderBy: [{ createdAt: "asc" }],
  });
  const imageUrl = image?.path ? convertToFullFilePath(image.path) : "";
  if (!subscriptions.length) return;

  const baseUrl = process.env.FRONTEND_URL || "";
  const productPath = `/shop-details/${slug}`;
  const productUrl = baseUrl ? `${baseUrl}${productPath}` : "";


  await Promise.all(
    subscriptions.map(async (subscription) => {
      const to = subscription.email || subscription.user?.email;
      if (!to) return;

      const userName = subscription.user?.name || "Customer";
      const result = await sendMail({
        to,
        subject: `${title} is back in stock`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hi ${userName},</p>
            <p><strong>${title}</strong> is now back in stock.</p>
            ${productUrl
              ? `<p>You can place your order here:</p><p><a href="${productUrl}" target="_blank" rel="noreferrer">${productUrl}</a></p>`
              : `<p>Please open the store and search for "${title}" to place your order.</p>`}
            <p>Thanks,<br/>DAMS Team</p>
          </div>
        `,
      });

      if (result?.success) {
        await prisma.productNotification.update({
          where: { id: subscription.id },
          data: {
            notified: true,
            notifiedAt: new Date(),
          },
        });
      }
    })
  );
};

export default {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductStockById,
  getProductById,
  subscribeProductRestockNotification,
};
