import jwt from "jsonwebtoken";
import userService from "../services/users.js";
import { ROLE_TYPES, STATUS_TYPES } from "../utils/constants.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req for next handlers
    req.user = await userService.getUserInfo(decoded);
    if(!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("JWT Verify Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {});

    if (req.user?.role !== ROLE_TYPES.ADMIN) {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Unauthorized" });
  }
};

export const conditionAdminMiddleware = (req, res, next) => {
  if(req.query.status && (req.query.status === STATUS_TYPES.ACTIVE)){
    return next();
  }
  return adminMiddleware(req, res, next);
}
