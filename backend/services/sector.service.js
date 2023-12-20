const catchAsyncError = require("../middleware/catchAsyncError");
const SectorModel = require("./path-to-your-model/SectorModel");

const createSector = catchAsyncError(async (name, parent) => {
  const sector = new SectorModel({
    name,
    parent,
    level: parent ? parent.level + 1 : 1,
  });

  const savedSector = await sector.save();
  return savedSector;
});

const getSectorById = catchAsyncError(async (id) => {
  const sector = await SectorModel.findById(id).populate("parent");
  if (!sector) {
    throw new Error("Sector not found");
  }
  return sector;
});

const getAllSectors = catchAsyncError(async () => {
  const sectors = await SectorModel.find({}).populate("parent");
  return sectors;
});

module.exports = {
  createSector,
  getSectorById,
  getAllSectors,
};
