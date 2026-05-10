const express = require("express");

const {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateMiddleware");
const {
  createTaskValidation,
  taskIdParamValidation,
  updateTaskStatusValidation,
  updateTaskValidation,
} = require("../validations/taskValidation");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("Admin"), createTaskValidation, validateRequest, createTask)
  .get(getTasks);

router
  .route("/:id")
  .get(taskIdParamValidation, validateRequest, getTaskById)
  .put(
    authorizeRoles("Admin"),
    taskIdParamValidation,
    updateTaskValidation,
    validateRequest,
    updateTask
  )
  .delete(authorizeRoles("Admin"), taskIdParamValidation, validateRequest, deleteTask);

router.patch(
  "/:id/status",
  taskIdParamValidation,
  updateTaskStatusValidation,
  validateRequest,
  updateTaskStatus
);

module.exports = router;
