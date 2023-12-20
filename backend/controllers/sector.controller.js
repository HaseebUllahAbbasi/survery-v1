const CustomError = require("../middleware/CustomError");
const catchAsyncError = require("../middleware/catchAsyncError");
const sectorService = require("../services/sector.service");

const createSector = catchAsyncError(async (req, res) => {
  const { name, parent } = req.body;
  const sector = await sectorService.createSector(name, parent);
  res.status(201).json({ sector });
});

const getSectorById = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const sector = await sectorService.getSectorById(id);
  res.json({ sector });
});

const getAllSectors = catchAsyncError(async (req, res) => {
  const sectors = await sectorService.getAllSectors();
  res.json({ sectors });
});

module.exports = {
  createSector,
  getSectorById,
  getAllSectors,
};
