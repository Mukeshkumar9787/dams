import prisma from "../prisma/client.js";
import { FEATURE_TYPES } from "../utils/constants.js";
import { convertToFullFilePath, deleteFiles } from "../utils/helpers.js";
import { fileService } from "./index.js";

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

  if (!user) {
    return null;
  }

  const profilePicture = await prisma.file.findFirst({
    where: {
      feature: FEATURE_TYPES.USER,
      featureId: user.id,
    },
    select: {
      id: true,
      path: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    ...user,
    profilePictureFileId: profilePicture ? profilePicture.id : null,
    profilePicture: profilePicture?.path ? convertToFullFilePath(profilePicture.path) : null,
  };
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


const updateProfile = async (id, { name, mobile, fileIds = [], deletedFileIds = [] }) => {
  let user = null;
  let deletedFiles = [];

  await prisma.$transaction(async (tx) => {
    const [, fileResult] = await Promise.all([
      tx.user.update({
        where: { id  },
        data: {
          name,
          mobile
        }
      }),
      fileService.updateFilesByIds({
        tx,
        feature: FEATURE_TYPES.USER,
        featureId: id,
        fileIds,
        deletedFileIds
      })
    ]);

    deletedFiles = fileResult.deletedRecords || [];
  });

  if (deletedFiles.length > 0) {
    deleteFiles(deletedFiles);
  }

  user = await getUserInfo({ id });

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
