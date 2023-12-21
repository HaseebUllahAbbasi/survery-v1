const catchAsyncError = require("../middleware/catchAsyncError");
const SectorModel = require("../models/Sector.model");

const createSector = catchAsyncError(async (name, parent, level) => {
  const sector = new SectorModel({
    name,
    parent,
    level: level || 1,
  });

  const savedSector = await sector.save();
  return savedSector;
});

const getSectorById = catchAsyncError(async (id) => {
  const sector = await SectorModel.findById(id);
  if (!sector) {
    throw new Error("Sector not found");
  }
  return sector;
});
const getAllSectors = catchAsyncError(async () => {
  const sectors = await SectorModel.find();
  const sectorTree = buildSectorTree(sectors, null); // Start building the tree from the top (root) level
  return sectorTree;
});

// Recursive function to build the sector tree
const buildSectorTree = (sectors, parentId) => {
  const filteredSectors = sectors.filter((sector) =>
    sector.parent ? sector.parent.toString() === parentId : !parentId
  );

  const sectorTree = filteredSectors.map((sector) => {
    const children = buildSectorTree(sectors, sector._id.toString());
    return {
      _id: sector._id.toString(),
      name: sector.name,
      level: sector.level,
      parent: sector.parent ? sector.parent.toString() : null,
      children: children.length > 0 ? children : null,
    };
  });

  return sectorTree;
};

module.exports = {
  createSector,
  getSectorById,
  getAllSectors,
};
