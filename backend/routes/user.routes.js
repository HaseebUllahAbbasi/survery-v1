const express = require("express");
const router = express.Router();
const userDataController = require("../controllers/user.controller");

router.post("/users", userDataController.createUser);
router.get("/users/:id", userDataController.getUserById);
router.get("/users", userDataController.getAllUsers);

module.exports = router;
