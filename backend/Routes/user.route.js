const express = require("express");
const { check, validationResult } = require("express-validator");
// const User = require("../Schema/user.schema");
const auth = require("../Middlewares/user.middleware");
const {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  deleteUser,
} = require("../Controllers/user.controller");

const router = express.Router();

// Register a user
router.post(
  "/register",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 4,
    }),
    check("mobile", "mobile number is required")
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
  ],
  registerUser
);

// Login a user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

// U[date user]
router.put(
  "/updateUser",
  auth,
  [
    // Validate fields only if they are present in the request
    check("name").optional().not().isEmpty().withMessage("name is required"),
    check("email")
      .optional()
      .isEmail()
      .withMessage("Please include a valid email"),
    check("mobile")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Mobile number is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Call the updateUser controller function
    updateUser(req, res);
  }
);

router.get("/getUser", auth, getUser);

router.delete("/deleteUser", auth, deleteUser);

module.exports = router;
