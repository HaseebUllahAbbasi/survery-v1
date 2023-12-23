const mongoose = require("mongoose");

const userData = new mongoose.Schema({
  name: { type: String, required: [true, "please enter the name"] },
  sectors: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  agreed: { type: Boolean, required: [true, "please enter the agreed status"] },
});
const UserDataModel = mongoose.model("usersData", userData);

module.exports = UserDataModel;
