import prisma from "../prisma/client.js";

const getUserInfo = async ({ id }) => {
  const user = await prisma.user.findUnique({ where: { id  } });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};


export default {
  getUserInfo
};
