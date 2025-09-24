import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "no-show"],
      default: "confirmed",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot be more than 500 characters"],
      trim: true,
    },
    cancellationReason: {
      type: String,
      maxlength: [200, "Cancellation reason cannot be more than 200 characters"],
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate bookings
bookingSchema.index({ session: 1, user: 1 }, { unique: true })

// Index for better query performance
bookingSchema.index({ user: 1, status: 1 })
bookingSchema.index({ session: 1, status: 1 })

// Virtual for checking if booking can be cancelled
bookingSchema.virtual("canBeCancelled").get(function () {
  if (this.status !== "confirmed") return false

  // Can cancel if session is more than 2 hours away
  const sessionDate = new Date(this.session?.dateTime || this.populated("session")?.dateTime)
  const now = new Date()
  const hoursUntilSession = (sessionDate - now) / (1000 * 60 * 60)

  return hoursUntilSession > 2
})

// Pre-save middleware to set cancellation date
bookingSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "cancelled" && !this.cancelledAt) {
    this.cancelledAt = new Date()
  }
  next()
})

// Static method to check if user can book a session
bookingSchema.statics.canUserBookSession = async function (userId, sessionId) {
  // Check if user already has a booking for this session
  const existingBooking = await this.findOne({
    user: userId,
    session: sessionId,
    status: { $in: ["confirmed", "completed"] },
  })

  return !existingBooking
}

// Instance method to cancel booking
bookingSchema.methods.cancel = function (reason) {
  this.status = "cancelled"
  this.cancellationReason = reason
  this.cancelledAt = new Date()
  return this.save()
}

// Ensure virtual fields are serialized
bookingSchema.set("toJSON", { virtuals: true })

export default mongoose.model("Booking", bookingSchema)
