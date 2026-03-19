import prisma from "../prisma/client.js";

const getWhere = ({ search, action }) => {
  const searchValue = search?.trim();
  const where = {};

  if (action) {
    where.action = action;
  }

  if (searchValue) {
    where.OR = [
      { entity: { contains: searchValue, mode: "insensitive" } },
      { route: { contains: searchValue, mode: "insensitive" } },
      { user: { name: { contains: searchValue, mode: "insensitive" } } },
      { user: { email: { contains: searchValue, mode: "insensitive" } } },
    ];
  }

  return where;
};

const getAll = async ({ page = 1, pageSize = 10, search, action }) => {
  const skip = (page - 1) * pageSize;
  const where = getWhere({ search, action });

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, totalCount };
};

const getStats = async () => {
  const [totalCount, groupedActions] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.groupBy({
      by: ["action"],
      _count: {
        action: true,
      },
      orderBy: {
        action: "asc",
      },
    }),
  ]);

  const actionStats = groupedActions.reduce((acc, item) => {
    acc[item.action] = item._count.action;
    return acc;
  }, {});

  return {
    totalCount,
    actionStats,
  };
};

export default {
  getAll,
  getStats,
};
