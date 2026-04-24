const express = require("express");

const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const validateCreateTask = require("../middlewares/validateCreateTask");
const validateUpdateTask = require("../middlewares/validateUpdateTask");

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateTask, taskController.create);
router.get("/", taskController.list);
router.get("/:id", taskController.getById);
router.patch("/:id", validateUpdateTask, taskController.update);
router.delete("/:id", taskController.remove);

module.exports = router;
