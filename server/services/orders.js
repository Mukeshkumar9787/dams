import prisma from "../prisma/client.js";
import { ERR_CODES, FEATURE_TYPES, getNextOrderStatuses, ORDER_STATUS, PAYMENT_TYPES, STATUS_TYPES, STOCK_TYPES } from "../utils/constants.js";
import { generateOrderNo, getFullAddress } from "../utils/helpers.js";
import { fileService, productService } from "./index.js";
import { createPayment, razorpayInstance } from "./payment.js";

const createOrder = async ({ name, mobile, address, city, pincode, country, state, isDiffBillAdd, billingName, billingMobile, billingAddress, billingCity, billingPincode, billingCountry, billingState, notes, orderProducts = [], userId }) => {
  const amount = orderProducts.reduce((a,c) => a + (c.price * c.quantity), 0);
  const payment = await createPayment({ amount });
  const order = await prisma.$transaction(async (tx) => {
    const errors = [];
    const order = await tx.order.create({
      data: {
        orderNo: generateOrderNo(userId),
        name, mobile, address, city, pincode, country, state, 
        isDiffBillAdd,
        billingInfo: isDiffBillAdd ? { billingName, billingMobile, billingAddress, billingCity, billingPincode, billingCountry, billingState } : null, 
        notes: notes || null,
        userId,
        paymentType: PAYMENT_TYPES.ONLINE,
        status: ORDER_STATUS.PAYMENT_PENDING,
        paymentOrderId: payment.id
      }
    })
    await Promise.all(orderProducts.map(async (prod) => {
      const dbProduct = await productService.getProductById({ id: prod.productId, tx, include: {Hsn: {select: {tax: true}}} });
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
          tax: dbProduct?.Hsn?.tax || 0,
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
  return {...order, payment }
};

const getOrders = async ({ userId=null, skip=0, take=10, search }) => {
  const where = { 
      userId: userId ? userId : undefined,
      orderNo: search ? {
        contains: search,
        mode: 'insensitive'
      } : undefined
  };

  const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          orderProducts: {
            select: {
              productId: true,
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
  const files = await fileService.getFilesByFeatureIds({ feature: FEATURE_TYPES.PRODUCT, featureIds: orders.filter(i => i.orderProducts.length > 0).map(i => i.orderProducts?.[0]?.productId)});
  return {
    data: orders.map(i => ({
        name: i.name,
        orderNo: i.orderNo,
        createdAt: i.createdAt,
        status: i.status,
        title: i.orderProducts.map(i => i.product.title).join(','),
        price: i.orderProducts.reduce((a, c) => a + c.price, 0),
        address: getFullAddress(i),
        get billingAddress(){ 
          return i.isDiffBillAdd ? getFullAddress(i.billingInfo) : this.address 
        },
        filePath: files.find(f => i.orderProducts?.[0]?.productId === f.featureId)?.path || null,
        user: i.user
      }
    )),
    totalCount
  };
}

const getOrder = async ({ userId=null, orderNo }) => {
  const where = { 
      orderNo,
      userId: userId ? userId : undefined,
  };
  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      orderProducts: {
        select: {
          productId: true,
          price: true,
          quantity: true,
          product: {
            select: { title: true, slug: true }
          },
        },
        orderBy: { id: 'asc' }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if(orders.length === 0) {
    let err =  new Error("Order Not found");
    err.statusCode = 404;
    throw err;
  }

  const order = orders[0];

  const files = await fileService.getFilesByFeatureIds({ feature: FEATURE_TYPES.PRODUCT, featureIds: order.orderProducts.map(i => i.productId)})
  const isAdmin = !userId;
  const orderStatusHistory = await prisma.orderStatusHistory.findMany({
    where: { orderId: order.id },
    select: { id:true, createdAt: true, status: true, user: isAdmin ? {select: { name: true }} : undefined, meta: true },
    orderBy: {
      createdAt: 'asc'
    }
  })
  if(order.status === ORDER_STATUS.PAYMENT_PENDING){
    await fetchOrderStatusAndUpdateDB(order.paymentOrderId);
  }
  return {
    name: order.name,
    orderNo: order.orderNo,
    createdAt: order.createdAt,
    status: order.status,
    totalPrice: order.orderProducts.reduce((a, c) => a + (c.price * c.quantity), 0),
    notes: order.notes,
    address: getFullAddress(order),
    paymentType: order.paymentType,
    get billingAddress(){ 
      return order.isDiffBillAdd ? getFullAddress(order.billingInfo, true) : this.address 
    },
    products: order.orderProducts.map(i => ({
      slug: i.product.slug,
      title: i.product.title,
      price: i.price,
      quantity: i.quantity,
      img: files.filter(f => f.featureId === i.productId).map( i => ({path: i.path}))?.[0]?.path || null
    })),
    user: order.user,
    orderStatusHistory
  };
}

const updateOrderStatus = async ({ orderNo, status, userId, meta = null }) => {
  return await prisma.$transaction(async (tx) => {
      const dbOrder = await tx.order.findUnique({
        where: {
          orderNo
        }
      });
      if(!dbOrder) {
        let err =  new Error("Order Not found");
        err.statusCode = 404;
        throw err;
      }
      if(!getNextOrderStatuses(dbOrder.status).includes(status)){
        let err =  new Error(`Order is ${dbOrder.status}, cannot be changed to ${status} !`);
        err.statusCode = 403;
        throw err;
      }
      const promises = [
        tx.order.update({
          where: {
            orderNo
          },
          data: {
            status
          }
        }),
        tx.orderStatusHistory.create({ 
            data: { orderId: dbOrder.id, status, userId, meta }
        })
      ];
      if(status === ORDER_STATUS.REJECTED){
        updateOrderProductStockStatus({tx, orderId: dbOrder.id, status: STOCK_TYPES.WITHDRAW })
      }
      await Promise.all(promises); 
  })
}

const updateOrderProductStockStatus = async ({ tx, orderId, status }) => {
  return await tx.$queryRaw`
    update "Stock" s set "type" = ${status}
    from "OrderProducts" op 
    where s.id = op."stockId" and op."orderId" = ${orderId};
  `
}

const updateOrderStatusByPaymentId = async ({ paymentOrderId, status, stockStatus}) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({ data: {status},where: { paymentOrderId }});
      if(!order){
        throw new Error("Order not found");
      }
      await updateOrderProductStockStatus({ tx, orderId: order.id, status: stockStatus })
      await tx.orderStatusHistory.create({ 
          data: { orderId: order.id, status, userId: order.userId }
      })
    })
  } catch (error) {
    
  }
}

const fetchOrderStatusAndUpdateDB = async (paymentOrderId) => {
  const razorpayOrder = await razorpayInstance.orders.fetch(paymentOrderId);
  if(razorpayOrder.status === 'paid'){
    await updateOrderStatusByPaymentId({ paymentOrderId, status: ORDER_STATUS.PLACED, stockStatus: STOCK_TYPES.ORDER});
  }
}

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  updateOrderProductStockStatus,
  updateOrderStatusByPaymentId
};
