import prisma from "../prisma/client.js";
import { ERR_CODES, ORDER_STATUS, PAYMENT_TYPES, STATUS_TYPES, STOCK_TYPES } from "../utils/constants.js";
import { productService } from "./index.js";

const createOrder = async ({ name, mobile, address, city, pincode, country, state, isDiffBillAdd, billingName, billingMobile, billingCity, billingPincode, billingCountry, billingState, notes, orderProducts = [], userId }) => {
  return await prisma.$transaction(async (tx) => {
    const errors = [];
    const order = await tx.order.create({
      data: {
        name, mobile, address, city, pincode, country, state, 
        isDiffBillAdd,
        billingInfo: isDiffBillAdd ? { billingName, billingMobile, billingCity, billingPincode, billingCountry, billingState } : null, 
        notes: notes || null,
        userId,
        paymentType: PAYMENT_TYPES.ONLINE,
        status: ORDER_STATUS.PAYMENT_PENDING,
      }
    })
    await Promise.all(orderProducts.map(async (prod) => {
      const dbProduct = await productService.getProductById({ id: prod.productId, tx });
      if(!dbProduct || dbProduct.status === STATUS_TYPES.INACTIVE){
        errors.push(`${prod.title} not found`);
      }
      if(prod.quantity > dbProduct.stock){
        if(dbProduct.stock === 0){
          errors.push(`${prod.title} is out of stock`);
        }else{
          errors.push(`${prod.title} has only ${dbProduct.stock} available quantity`);
        }
      };
      if(prod.price !== dbProduct.price){
        errors.push(`${prod.title} price changed`);
      }
      const stock = await tx.stock.create({
        data:{
          type: STOCK_TYPES.PAYMENT_PENDING,
          productId: parseInt(prod.productId),
          quantity: -parseInt(prod.quantity)
        }
      });
      await tx.orderProducts.create({
        data: {
          orderId: order.id,
          productId: prod.productId,
          quantity: prod.quantity,
          price: prod.price,
          mrp: prod.mrp,
          stockId: stock.id
        }
      })
    }));
    if(errors.length > 0) {
      const err = new Error(errors.join(','));
      err.statusCode = 400;
      err.code = ERR_CODES.ORDER_VALIDATION;
      throw err;
    }
    return order;
  })
};

const getOrders = async ({ userId=null, skip=0, take=10 }) => {
  const where = { 
      userId: userId ? userId : undefined,
  };
  const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderProducts: {
            select: {
              product: {
                select: { title: true }
              },
              price: true
            },
            orderBy: { id: 'asc' }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take
      }),
      prisma.order.count({
        where
      })
  ]) ;

  return {
    data: orders.map(i => ({
        orderNo: i.orderNo,
        createdAt: i.createdAt,
        status: i.status,
        title: i.orderProducts.map(i => i.product.title).join(','),
        price: i.orderProducts.reduce((a, c) => a + c.price, 0)
      }
    )),
    totalCount
  };
}

export default {
  createOrder,
  getOrders
};
