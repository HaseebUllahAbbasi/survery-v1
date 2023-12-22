const CustomError = require("../middleware/CustomError");
const catchAsyncError = require("../middleware/catchAsyncError");
const SectorModel = require("../models/Sector.model");
const UserDataModel = require("../models/User.model");
const { buildSectorTree } = require("./sector.service");

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

const updateUserById = async (id, name, sectors, agreed) => {
  console.log("in updates", id);
  const userData = await UserDataModel.findByIdAndUpdate(id, {
    $set: {
      agreed,
      name,
      sectors,
    },
  });

  return userData;
};

const getAllUsers = catchAsyncError(async () => {
  const users = await UserDataModel.find();
  return users;
});
const getAllUsersWithSectors = catchAsyncError(async () => {
  // Fetch all users
  const users = await UserDataModel.find({});

  // Fetch all sectors and build the sector tree
  const sectors = await SectorModel.find();
  const sectorTree = buildSectorTree(sectors, null);

  // Map user data with associated sector information
  const usersWithSectors = users.map((user) => {
    const userSectors = user.sectors.map((sectorId) => {
      const sectorInfo = findSectorInfo(sectorTree, sectorId.toString());
      return sectorInfo;
    });

    return {
      _id: user._id.toString(),
      name: user.name,
      sectors: userSectors,
      agreed: user.agreed,
    };
  });

  return usersWithSectors;
});

// Recursive function to find sector information by ID
const findSectorInfo = (sectorTree, sectorId) => {
  for (const sector of sectorTree) {
    if (sector._id === sectorId) {
      return {
        _id: sector._id,
        name: sector.name,
        level: sector.level,
        parent: sector.parent,
        children: sector.children,
      };
    }

    if (sector.children) {
      const found = findSectorInfo(sector.children, sectorId);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

module.exports = {
  getAllUsersWithSectors,
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  getAllUsers,
};
