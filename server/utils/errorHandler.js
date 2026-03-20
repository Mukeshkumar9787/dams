import { Prisma } from '../prisma/generated/client.ts';

function errorHandler(err, res) {
  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint
    if (err.code === "P2002") {
      err.statusCode = 400;
      err.message = `${err.message} already exists`;
    }
    if (err.code === "P2025") {
      err.statusCode = 404;
      err.message = `${err.message} not found`;
    }
  }

  return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong",
      data: err.data || null,
      code: err.code || null
    });
}

export { errorHandler };
