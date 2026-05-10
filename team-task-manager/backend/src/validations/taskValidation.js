const { body, param } = require("express-validator");

const TASK_STATUSES = ["Todo", "In Progress", "Done"];

const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Task title must be between 2 and 120 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1500 })
    .withMessage("Task description cannot exceed 1500 characters"),
  body("project")
    .notEmpty()
    .withMessage("Project id is required")
    .isMongoId()
    .withMessage("Project id must be a valid MongoDB ObjectId"),
  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned member id is required")
    .isMongoId()
    .withMessage("Assigned member id must be a valid MongoDB ObjectId"),
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Status must be one of: Todo, In Progress, Done"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Task title must be between 2 and 120 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1500 })
    .withMessage("Task description cannot exceed 1500 characters"),
  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project id must be a valid MongoDB ObjectId"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Assigned member id must be a valid MongoDB ObjectId"),
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Status must be one of: Todo, In Progress, Done"),
  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
];

const updateTaskStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(TASK_STATUSES)
    .withMessage("Status must be one of: Todo, In Progress, Done"),
];

const taskIdParamValidation = [
  param("id").isMongoId().withMessage("Task id must be a valid MongoDB ObjectId"),
];

module.exports = {
  createTaskValidation,
  taskIdParamValidation,
  updateTaskStatusValidation,
  updateTaskValidation,
};
