const express = require("express");
const router = express.Router();
const sectorController = require("../controllers/sector.controller");

router.post("/sectors", sectorController.createSector);
router.get("/sectors/:id", sectorController.getSectorById);
router.get("/sectors", sectorController.getAllSectors);

module.exports = router;
