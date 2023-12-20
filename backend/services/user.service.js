const CustomError = require("../middleware/CustomError");
const catchAsyncError = require("../middleware/catchAsyncError");
const UserDataModel = require("../models/User.model");

const createUser = catchAsyncError(async (name, sectors, agreed) => {
  const userData = new UserDataModel({
    name,
    sectors,
    agreed,
  });

  const savedUserData = await userData.save();
  return savedUserData;
});

const getUserById = catchAsyncError(async (id) => {
  const userData = await UserDataModel.findById(id);
  if (!userData) {
    throw new CustomError("User data not found", 404);
  }
  return userData;
});

const getAllUsers = catchAsyncError(async () => {
  const users = await UserDataModel.find({});
  return users;
});

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
};
