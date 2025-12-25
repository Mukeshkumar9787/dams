import { Prisma } from "@prisma/client";

function errorHandler(err, res) {
  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint
    if (err.code === "P2002") {
      err.statusCode = 400;
      err.message = `${err.message} already exists`;
    }
  }

  return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
}

export { errorHandler };