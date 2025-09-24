import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a session title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a session description"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a session category"],
      enum: {
        values: ["Tech", "Career", "Design", "Business", "Marketing", "Health", "Education", "Other"],
        message: "Please select a valid category",
      },
    },
    dateTime: {
      type: Date,
      required: [true, "Please provide a session date and time"],
      validate: {
        validator: (value) => value > new Date(),
        message: "Session date must be in the future",
      },
    },
    duration: {
      type: Number,
      required: [true, "Please provide session duration"],
      min: [15, "Session duration must be at least 15 minutes"],
      max: [480, "Session duration cannot exceed 8 hours (480 minutes)"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "completed", "cancelled"],
      default: "available",
    },
    maxParticipants: {
      type: Number,
      default: 1,
      min: [1, "Session must allow at least 1 participant"],
      max: [50, "Session cannot have more than 50 participants"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: "Cannot have more than 10 tags",
      },
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
sessionSchema.index({ category: 1, status: 1, dateTime: 1 })
sessionSchema.index({ creator: 1 })

// Virtual for formatted date
sessionSchema.virtual("formattedDate").get(function () {
  return this.dateTime.toLocaleDateString()
})

// Virtual for formatted time
sessionSchema.virtual("formattedTime").get(function () {
  return this.dateTime.toLocaleTimeString()
})

// Ensure virtual fields are serialized
sessionSchema.set("toJSON", { virtuals: true })

export default mongoose.model("Session", sessionSchema)
