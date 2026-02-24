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

const getAll = async ({ skip=0, take=10, search, role }) => {
  const where = { role: role || undefined };
  if(search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { mobile: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take
      }),
      prisma.user.count({
        where
      })
  ]);
  return { users, totalCount };
}

const changeRole = async ({ id, role }) => {
  const user = await prisma.user.update({ 
    where: { id  },
    data: {
      role
    }
  });

  return user;
};


export default {
  getUserInfo,
  updateProfile,
  getUsers,
  getAll,
  changeRole
};
