import express from "express"
import { body } from "express-validator"
import { getProfile, updateProfile } from "../controllers/userController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Validation rules for profile update
const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("bio").optional().trim().isLength({ max: 500 }).withMessage("Bio cannot be more than 500 characters"),
  body("skills").optional().isArray({ max: 10 }).withMessage("Skills must be an array with maximum 10 items"),
]

// All routes are protected
router.use(protect)

// Routes
router.get("/profile", getProfile)
router.put("/profile", updateProfileValidation, updateProfile)

export default router
