const Project = require("../models/Project");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();

  const taskFilter =
    req.user.role === "Admin"
      ? { createdBy: req.user._id }
      : { assignedTo: req.user._id };

  const [totalTasks, completedTasks, pendingTasks, overdueTasks, totalProjects] =
    await Promise.all([
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: "Done" }),
      Task.countDocuments({ ...taskFilter, status: { $ne: "Done" } }),
      Task.countDocuments({ ...taskFilter, status: { $ne: "Done" }, dueDate: { $lt: now } }),
      req.user.role === "Admin"
        ? Project.countDocuments({ createdBy: req.user._id })
        : Project.countDocuments({ members: req.user._id }),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    },
  });
});

module.exports = {
  getDashboardStats,
};
