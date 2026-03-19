import { errorHandler } from "../utils/errorHandler.js";
import dashboardService from "../services/dashboard.js";

const getAdminDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  getAdminDashboard,
};
