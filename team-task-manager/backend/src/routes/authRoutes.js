const express = require("express");

const { getMe, getUsers, login, signup } = require("../controllers/authController");
const { loginValidation, signupValidation } = require("../validations/authValidation");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");

const router = express.Router();

router.post("/signup", signupValidation, validateRequest, signup);
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", protect, getMe);
router.get("/users", protect, authorizeRoles("Admin"), getUsers);

module.exports = router;
