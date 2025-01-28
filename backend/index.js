const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

var device = require("express-device");

const userRoutes = require("./Routes/user.route");
const linkRoutes = require("./Routes/url.route");
const urlRedirectRoute = require("./Routes/redirect.route");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  device.capture({
    parseUserAgent: true,
  })
);

device.enableViewRouting(app);

// Route middleware for user authentication (register/login)
app.use("/api/auth", userRoutes);

app.use("/api/links", linkRoutes);

app.use("/", urlRedirectRoute);

// app.get("/", (req, res) => {
//   res.send("Mani");
//   var accessDate;
//   accessDate = new Date();

//   console.log(
//     "Device Type: " +
//       req.device.type.toUpperCase() +
//       " Device Name:" +
//       req.device.description +
//       " Date: " +
//       accessDate.toDateString()
//   );
//   console.log(req.device);
//   res.json({ device: req.device.type, ip: req.ip });
// });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Define the port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
