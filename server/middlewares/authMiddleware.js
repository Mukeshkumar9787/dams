import jwt from "jsonwebtoken";
import userService from "../services/users.js";

export const getAuthMiddleware = (allowedRoles=[], isPassThrough = null) => {
  return async(req, res, next) => {
    if(isPassThrough(req)){
      next();
      return;
    }
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

    if ((allowedRoles.length === 0) || allowedRoles.includes(req.user.role)) {
      next();      
      return; 
    }
    return res.status(403).json({ message: "Forbidden" });
  };
};

