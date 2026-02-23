import prisma from "../prisma/client.js";

const getUserInfo = async ({ id }) => {
  const user = await prisma.user.findUnique({ 
    where: { id  },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      mobile: true,
      role: true
    }
  });

  return user;
};

const getUsers = async ({ role }) => {
  const users = await prisma.user.findMany({ 
    where: { role  },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      mobile: true,
    }
  });

  return users;
};


const updateProfile = async (id, { name, mobile }) => {
  const user = await prisma.user.update({ 
    where: { id  },
    data: {
      name,
      mobile
    }
  });

  return user;
};


export default {
  getUserInfo,
  updateProfile,
  getUsers
};
