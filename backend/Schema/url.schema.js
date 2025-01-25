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
    expiryDate: { type: Date },

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("UrlSchema", urlSchema);
