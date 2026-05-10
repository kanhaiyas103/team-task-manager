const express = require("express");

const {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
  updateProjectMembers,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const validateRequest = require("../middleware/validateMiddleware");
const {
  createProjectValidation,
  projectIdParamValidation,
  projectMembersValidation,
  updateProjectValidation,
} = require("../validations/projectValidation");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("Admin"), createProjectValidation, validateRequest, createProject)
  .get(getProjects);

router
  .route("/:id")
  .get(projectIdParamValidation, validateRequest, getProjectById)
  .put(
    authorizeRoles("Admin"),
    projectIdParamValidation,
    updateProjectValidation,
    validateRequest,
    updateProject
  )
  .delete(authorizeRoles("Admin"), projectIdParamValidation, validateRequest, deleteProject);

router.patch(
  "/:id/members",
  authorizeRoles("Admin"),
  projectIdParamValidation,
  projectMembersValidation,
  validateRequest,
  updateProjectMembers
);

module.exports = router;
