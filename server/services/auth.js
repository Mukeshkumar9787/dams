import bcrypt from "bcrypt";

const register = async ({ name, email, password, mobile }) => {
  // Check existing user
  const existing = null;

  if (existing) {
    const err = new Error("Email already exists");
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return {};
};

const login = async ({ email, password }) => {
  const user = null;

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

  return user;
};

// Export as default object for easy import
export default {
  register,
  login,
};
