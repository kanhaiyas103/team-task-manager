const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const normalizeMembers = (members, creatorId) => {
  const ids = (members || []).map((id) => id.toString());
  const creator = creatorId.toString();

  if (!ids.includes(creator)) {
    ids.push(creator);
  }

  return [...new Set(ids)];
};

const ensureUsersExist = async (userIds) => {
  const existing = await User.countDocuments({ _id: { $in: userIds } });
  if (existing !== userIds.length) {
    throw new ApiError(400, "One or more member ids are invalid");
  }
};

const createProject = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body;
  const memberIds = normalizeMembers(members, req.user._id);

  await ensureUsersExist(memberIds);

  const project = await Project.create({
    title,
    description,
    members: memberIds,
    createdBy: req.user._id,
  });

  const populated = await Project.findById(project._id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    project: populated,
  });
});

const getProjects = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "Admin"
      ? { createdBy: req.user._id }
      : { members: req.user._id };

  const projects = await Project.find(filter)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const isAdminOwner =
    req.user.role === "Admin" &&
    project.createdBy._id.toString() === req.user._id.toString();
  const isMember = project.members.some(
    (member) => member._id.toString() === req.user._id.toString()
  );

  if (!isAdminOwner && !isMember) {
    throw new ApiError(403, "You do not have access to this project");
  }

  res.status(200).json({
    success: true,
    project,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const project = await Project.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found or not owned by you");
  }

  if (title !== undefined) {
    project.title = title;
  }

  if (description !== undefined) {
    project.description = description;
  }

  await project.save();

  const populated = await Project.findById(project._id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    project: populated,
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found or not owned by you");
  }

  await Task.deleteMany({ project: project._id });

  res.status(200).json({
    success: true,
    message: "Project and related tasks deleted successfully",
  });
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { members } = req.body;
  const project = await Project.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found or not owned by you");
  }

  const memberIds = normalizeMembers(members, req.user._id);
  await ensureUsersExist(memberIds);

  project.members = memberIds;
  await project.save();

  const populated = await Project.findById(project._id)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  res.status(200).json({
    success: true,
    message: "Project members updated successfully",
    project: populated,
  });
});

module.exports = {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
  updateProjectMembers,
};
