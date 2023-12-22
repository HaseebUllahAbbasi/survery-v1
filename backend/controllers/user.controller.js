const CustomError = require("../middleware/CustomError");
const catchAsyncError = require("../middleware/catchAsyncError");
const userService = require("../services/user.service");

const createUser = catchAsyncError(async (req, res, next) => {
  const { name, sectors, agreed } = req.body;

  const savedUserData = await userService.createUser(name, sectors, agreed);

  res.status(201).json({
    success: true,
    user: savedUserData,
  });
});

const getUserById = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const userData = await userService.getUserById(userId);

  res.status(200).json({
    success: true,
    data: userData,
  });
});

const updateUserById = catchAsyncError(async (req, res) => {
  const { id, name, sectors, agreed } = req.body;

  const updatedUserData = await userService.updateUserById(
    id,
    name,
    sectors,
    agreed
  );

  res.status(200).json({
    success: true,
    data: updatedUserData,
  });
});

const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json(users);
});

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  getAllUsers,
};
