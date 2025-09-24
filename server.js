import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// Import routes
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import sessionRoutes from "./routes/sessions.js"
import bookingRoutes from "./routes/bookings.js"

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/bookings", bookingRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Session Booker API is running!",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Connect to MongoDB and start server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ MongoDB connected successfully")

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

connectDB()

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message)
  process.exit(1)
})
