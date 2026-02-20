import prisma from "../prisma/client.js";

const createOrUpdate = async ({ config }) => {
  return await prisma.$transaction(async (tx) => {
    const result = [];
    for (const [key,value] of Object.entries(config)) {
      const r = await tx.config.upsert({ where: { key }, create: { key, value }, update: { value } });
      result.push(r);
    }
    return result;
  })
};

const getAll = async () => {
  const config = await prisma.config.findMany({ select: {key: true, value: true}});
  return config.reduce((a,c) => {a[c.key] = c.value; return a}, {});
};


export default {
  createOrUpdate,
  getAll
};
