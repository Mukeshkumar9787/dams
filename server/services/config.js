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

const getAll = async ({'configs[]': configs = null}) => {
  let where = {}
  if(configs) {
    if(typeof(configs) === 'string'){
      where = { key: configs };
    }else{
      where = { key: { in : configs } };
    }
  }
  const config = await prisma.config.findMany({ select: {key: true, value: true}, where});
  return config.reduce((a,c) => {a[c.key] = c.value; return a}, {});
};


export default {
  createOrUpdate,
  getAll
};
