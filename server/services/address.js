import prisma from "../prisma/client.js";

const create = async (userId, { name, mobile, address, city, pincode, country, state }) => {
  const result = await prisma.address.create({
    data: {
      userId,
      name,
      mobile,
      address,
      city,
      pincode,
      country,
      state,
    },
  });
  return result;
};

const getByUserId = async (userId) => {
  const data = await prisma.address.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return data;
};

const remove = async (userId, id) => {
  const result = await prisma.address.deleteMany({
    where: {
      id,
      userId,
    },
  });
  if (!result.count) {
    const err = new Error("Address not found");
    err.statusCode = 404;
    throw err;
  }
  return result;
};

const update = async (userId, id, data) => {
  const result = await prisma.address.updateMany({
    where: {
      id,
      userId,
    },
    data,
  });
  if (!result.count) {
    const err = new Error("Address not found");
    err.statusCode = 404;
    throw err;
  }
  return prisma.address.findUnique({ where: { id } });
};

export default {
  create,
  getByUserId,
  remove,
  update,
};
