const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "Member",
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "Signup successful",
    token,
    user: formatUserResponse(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: formatUserResponse(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "name email role").sort({ name: 1 });

  res.status(200).json({
    success: true,
    users: users.map(formatUserResponse),
  });
});

module.exports = {
  getMe,
  getUsers,
  login,
  signup,
};
