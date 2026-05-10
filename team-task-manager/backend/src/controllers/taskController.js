const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const taskPopulation = [
  { path: "project", select: "title description createdBy members" },
  { path: "assignedTo", select: "name email role" },
  { path: "createdBy", select: "name email role" },
];

const ensureAssignableMember = async (project, assignedTo) => {
  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    throw new ApiError(400, "Assigned member does not exist");
  }

  const isMemberInProject = project.members.some(
    (memberId) => memberId.toString() === assignedTo.toString()
  );

  if (!isMemberInProject) {
    throw new ApiError(400, "Assigned member must belong to the project");
  }
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, project: projectId, assignedTo, status, dueDate } = req.body;

  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found or not owned by you");
  }

  await ensureAssignableMember(project, assignedTo);

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo,
    createdBy: req.user._id,
    status: status || "Todo",
    dueDate,
  });

  const populated = await Task.findById(task._id).populate(taskPopulation);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task: populated,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "Admin"
      ? { createdBy: req.user._id }
      : { assignedTo: req.user._id };

  const tasks = await Task.find(filter).populate(taskPopulation).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(taskPopulation);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const isAdminOwner =
    req.user.role === "Admin" && task.createdBy._id.toString() === req.user._id.toString();
  const isAssignedMember = task.assignedTo._id.toString() === req.user._id.toString();

  if (!isAdminOwner && !isAssignedMember) {
    throw new ApiError(403, "You do not have access to this task");
  }

  res.status(200).json({
    success: true,
    task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, project: projectId, assignedTo, status, dueDate } = req.body;

  const task = await Task.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!task) {
    throw new ApiError(404, "Task not found or not owned by you");
  }

  let project = null;
  if (projectId || assignedTo) {
    project = await Project.findOne({
      _id: projectId || task.project,
      createdBy: req.user._id,
    });

    if (!project) {
      throw new ApiError(404, "Project not found or not owned by you");
    }
  }

  if (assignedTo) {
    await ensureAssignableMember(project, assignedTo);
    task.assignedTo = assignedTo;
  }

  if (projectId) {
    task.project = projectId;
  }
  if (title !== undefined) {
    task.title = title;
  }
  if (description !== undefined) {
    task.description = description;
  }
  if (status !== undefined) {
    task.status = status;
  }
  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }

  await task.save();

  const populated = await Task.findById(task._id).populate(taskPopulation);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: populated,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!task) {
    throw new ApiError(404, "Task not found or not owned by you");
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id).populate(taskPopulation);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const isAdminOwner =
    req.user.role === "Admin" && task.createdBy._id.toString() === req.user._id.toString();
  const isAssignedMember = task.assignedTo._id.toString() === req.user._id.toString();

  if (!isAdminOwner && !isAssignedMember) {
    throw new ApiError(403, "You do not have access to update this task status");
  }

  task.status = status;
  await task.save();

  const populated = await Task.findById(task._id).populate(taskPopulation);

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    task: populated,
  });
});

module.exports = {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
};
