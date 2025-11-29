import { authService } from "../services/index.js";

const register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      mobile,
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.id,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(err.statusCode || 500).json({
      error: err.message || "Something went wrong",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return res.status(200).json({
      message: "Login successful",
      userId: result.id,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(err.statusCode || 500).json({
      error: err.message || "Something went wrong",
    });
  }
};

// Export as default object for easier import in routes
export default {
  register,
  login,
};
