const express = require("express");

const userController = require("../controllers/userController");
const validateCreateUser = require("../middlewares/validateCreateUser");

const router = express.Router();

router.post("/", validateCreateUser, userController.create);

module.exports = router;

