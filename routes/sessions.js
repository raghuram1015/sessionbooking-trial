import express from "express"
import { body, query } from "express-validator"
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  getMyCreatedSessions,
} from "../controllers/sessionController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const createSessionValidation = [
  body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .isIn(["Tech", "Career", "Design", "Business", "Marketing", "Health", "Education", "Other"])
    .withMessage("Please select a valid category"),
  body("dateTime").isISO8601().withMessage("Please provide a valid date and time"),
  body("duration").isInt({ min: 15, max: 480 }).withMessage("Duration must be between 15 and 480 minutes"),
  body("maxParticipants")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Max participants must be between 1 and 50"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price cannot be negative"),
  body("tags").optional().isArray({ max: 10 }).withMessage("Tags must be an array with maximum 10 items"),
  body("meetingLink").optional().isURL().withMessage("Please provide a valid meeting link"),
  body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes cannot be more than 500 characters"),
]

const updateSessionValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .optional()
    .isIn(["Tech", "Career", "Design", "Business", "Marketing", "Health", "Education", "Other"])
    .withMessage("Please select a valid category"),
  body("dateTime").optional().isISO8601().withMessage("Please provide a valid date and time"),
  body("duration").optional().isInt({ min: 15, max: 480 }).withMessage("Duration must be between 15 and 480 minutes"),
  body("maxParticipants")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Max participants must be between 1 and 50"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price cannot be negative"),
  body("tags").optional().isArray({ max: 10 }).withMessage("Tags must be an array with maximum 10 items"),
  body("meetingLink").optional().isURL().withMessage("Please provide a valid meeting link"),
  body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes cannot be more than 500 characters"),
]

const queryValidation = [
  query("category")
    .optional()
    .isIn(["Tech", "Career", "Design", "Business", "Marketing", "Health", "Education", "Other"])
    .withMessage("Please select a valid category"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
]

// Public routes
router.get("/", queryValidation, getSessions)
router.get("/:id", getSession)

// Protected routes
router.use(protect)
router.post("/", createSessionValidation, createSession)
router.put("/:id", updateSessionValidation, updateSession)
router.delete("/:id", deleteSession)
router.get("/creator/me", getMyCreatedSessions)

export default router
