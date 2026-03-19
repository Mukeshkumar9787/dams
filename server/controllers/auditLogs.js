import auditLogService from "../services/auditLogs.js";
import { errorHandler } from "../utils/errorHandler.js";

const getAll = async (req, res) => {
  try {
    const { logs, totalCount } = await auditLogService.getAll({
      page: req.pagination?.page,
      pageSize: req.pagination?.pageSize,
      search: req.query.search,
      action: req.query.action,
    });

    return res.status(200).json({
      success: true,
      message: "Audit logs retrieved successfully",
      data: logs,
      totalCount,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

const getStats = async (req, res) => {
  try {
    const data = await auditLogService.getStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default {
  getAll,
  getStats,
};
