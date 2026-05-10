const { body, param } = require("express-validator");

const createProjectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Project title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Project description cannot exceed 1000 characters"),
  body("members")
    .optional()
    .isArray()
    .withMessage("Members must be an array of user ids"),
  body("members.*")
    .optional()
    .isMongoId()
    .withMessage("Each member id must be a valid MongoDB ObjectId"),
];

const updateProjectValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Project title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Project description cannot exceed 1000 characters"),
];

const projectMembersValidation = [
  body("members")
    .isArray({ min: 1 })
    .withMessage("Members must be a non-empty array of user ids"),
  body("members.*")
    .isMongoId()
    .withMessage("Each member id must be a valid MongoDB ObjectId"),
];

const projectIdParamValidation = [
  param("id").isMongoId().withMessage("Project id must be a valid MongoDB ObjectId"),
];

module.exports = {
  createProjectValidation,
  projectIdParamValidation,
  projectMembersValidation,
  updateProjectValidation,
};
