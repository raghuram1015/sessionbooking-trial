import express from "express"
import { body } from "express-validator"
import { createBooking, cancelBooking, getMyBookings, getBookingById } from "../controllers/bookingController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation rules
const createBookingValidation = [
  body("sessionId").isMongoId().withMessage("Please provide a valid session ID"),
  body("notes").optional().trim().isLength({ max: 500 }).withMessage("Notes cannot be more than 500 characters"),
]

const cancelBookingValidation = [
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Cancellation reason cannot be more than 200 characters"),
]

// Routes
router.get("/me", getMyBookings)
router.get("/:id", getBookingById)
router.post("/", createBookingValidation, createBooking)
router.delete("/:id", cancelBookingValidation, cancelBooking)

export default router
