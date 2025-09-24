import { validationResult } from "express-validator"
import Booking from "../models/Booking.js"
import Session from "../models/Session.js"
import { sendBookingConfirmation, sendBookingCancellation } from "../utils/emailService.js"

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { sessionId, notes } = req.body
    const userId = req.user.id

    // Check if session exists and is available
    const session = await Session.findById(sessionId).populate("creator", "name email")

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    if (session.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Session is not available for booking",
      })
    }

    // Check if session is in the future
    if (new Date(session.dateTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book sessions in the past",
      })
    }

    // Check if user is trying to book their own session
    if (session.creator._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own session",
      })
    }

    // Check if user can book this session (no existing booking)
    const canBook = await Booking.canUserBookSession(userId, sessionId)
    if (!canBook) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this session",
      })
    }

    // Create booking
    const booking = await Booking.create({
      session: sessionId,
      user: userId,
      notes,
    })

    // Update session status to booked
    await Session.findByIdAndUpdate(sessionId, { status: "booked" })

    // Populate booking data
    await booking.populate([
      { path: "session", populate: { path: "creator", select: "name email" } },
      { path: "user", select: "name email" },
    ])

    try {
      await sendBookingConfirmation(booking, booking.session, req.user)
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError)
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: "Session booked successfully",
      booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { reason } = req.body
    const bookingId = req.params.id
    const userId = req.user.id

    // Find booking
    const booking = await Booking.findById(bookingId).populate("session")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Check if user owns this booking
    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      })
    }

    // Check if booking can be cancelled
    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be cancelled",
      })
    }

    // Check if session is more than 2 hours away
    const sessionDate = new Date(booking.session.dateTime)
    const now = new Date()
    const hoursUntilSession = (sessionDate - now) / (1000 * 60 * 60)

    if (hoursUntilSession <= 2) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking less than 2 hours before the session",
      })
    }

    // Cancel booking
    await booking.cancel(reason)

    // Update session status back to available
    await Session.findByIdAndUpdate(booking.session._id, { status: "available" })

    try {
      await sendBookingCancellation(booking, booking.session, req.user)
    } catch (emailError) {
      console.error("Failed to send booking cancellation email:", emailError)
      // Don't fail the cancellation if email fails
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's bookings
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const userId = req.user.id

    // Build query
    const query = { user: userId }
    if (status) {
      query.status = status
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Booking.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Get bookings
    const bookings = await Booking.find(query)
      .populate({
        path: "session",
        populate: { path: "creator", select: "name email bio" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Separate upcoming and past bookings
    const now = new Date()
    const upcomingBookings = []
    const pastBookings = []

    bookings.forEach((booking) => {
      if (new Date(booking.session.dateTime) > now && booking.status === "confirmed") {
        upcomingBookings.push(booking)
      } else {
        pastBookings.push(booking)
      }
    })

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages,
      currentPage: Number.parseInt(page),
      bookings: {
        upcoming: upcomingBookings,
        past: pastBookings,
        all: bookings,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const bookingId = req.params.id
    const userId = req.user.id

    const booking = await Booking.findById(bookingId).populate([
      {
        path: "session",
        populate: { path: "creator", select: "name email bio skills" },
      },
      { path: "user", select: "name email bio" },
    ])

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Check if user owns this booking or is the session creator
    if (booking.user._id.toString() !== userId && booking.session.creator._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      })
    }

    res.status(200).json({
      success: true,
      booking,
    })
  } catch (error) {
    next(error)
  }
}
