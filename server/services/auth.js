import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const register = async ({ name, email, password, mobile }) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const err = new Error("Email already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      mobile: mobile || null,
    },
  });

  // generate jwt
  const token = generateToken(user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const token = generateToken(user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  };
};

export default {
  register,
  login,
};
