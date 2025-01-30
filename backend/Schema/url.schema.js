const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    destinationUrl: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    expiryDate: { type: Date, default: null },

    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    urlCode: {
      type: String,
      required: true,
      unique: true,
    },
    clickCount: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deviceDetails: [
      {
        deviceType: String, // E.g., Mobile, Tablet, Desktop
        ipAddress: String, // Store the IP address of the user
        clickedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    dailyClickCounts: [
      {
        date: {
          type: String, // Store the date as a string (e.g., "2025-01-26")
          required: true,
        },
        count: {
          type: Number, // Number of clicks for the specific date
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to update status based on expiry date
urlSchema.pre("save", function (next) {
  if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
    this.status = "Inactive";
  } else {
    this.status = "Active";
  }
  next();
});

module.exports = mongoose.model("UrlSchema", urlSchema);
