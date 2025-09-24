import { validationResult } from "express-validator"
import Session from "../models/Session.js"

// @desc    Get all sessions with filtering and pagination
// @route   GET /api/sessions
// @access  Public
export const getSessions = async (req, res, next) => {
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

    const { category, page = 1, limit = 10, search } = req.query

    // Build query
    const query = { status: "available", dateTime: { $gt: new Date() } }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Session.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Get sessions
    const sessions = await Session.find(query)
      .populate("creator", "name bio")
      .sort({ dateTime: 1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      totalPages,
      currentPage: Number.parseInt(page),
      sessions,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).populate("creator", "name bio skills")

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    res.status(200).json({
      success: true,
      session,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res, next) => {
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

    // Add creator to session data
    const sessionData = {
      ...req.body,
      creator: req.user.id,
    }

    // Validate future date
    if (new Date(sessionData.dateTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session date must be in the future",
      })
    }

    const session = await Session.create(sessionData)
    await session.populate("creator", "name bio")

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      session,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (only creator)
export const updateSession = async (req, res, next) => {
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

    let session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    // Check if user is the creator
    if (session.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this session",
      })
    }

    // Check if session is already booked
    if (session.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a booked session",
      })
    }

    // Validate future date if dateTime is being updated
    if (req.body.dateTime && new Date(req.body.dateTime) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session date must be in the future",
      })
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("creator", "name bio")

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      session,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (only creator)
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      })
    }

    // Check if user is the creator
    if (session.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this session",
      })
    }

    // Check if session is already booked
    if (session.status === "booked") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a booked session",
      })
    }

    await Session.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get sessions created by current user
// @route   GET /api/sessions/creator/me
// @access  Private
export const getMyCreatedSessions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query

    // Calculate pagination
    const skip = (page - 1) * limit
    const total = await Session.countDocuments({ creator: req.user.id })
    const totalPages = Math.ceil(total / limit)

    const sessions = await Session.find({ creator: req.user.id })
      .populate("creator", "name bio")
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      totalPages,
      currentPage: Number.parseInt(page),
      sessions,
    })
  } catch (error) {
    next(error)
  }
}
