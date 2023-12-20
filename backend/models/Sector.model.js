const mongoose = require("mongoose");

const Sector = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sector",
  },
  level: {
    type: Number,
    default: 1,
  },
});

const SectorModel = mongoose.model("Sector", Sector);
module.exports = SectorModel;
