const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/user.middleware");
const linkController = require("../Controllers/url.controller");
const { getDashboardStats } = require("../Controllers/dashboard.controller");

// Routes
router.post("/links", auth, linkController.shortenUrl);
router.get("/links", auth, linkController.getInfo);
router.get("/analytics", auth, linkController.getAnalytics);
router.get("/links/:id", auth, linkController.getLinkById);
router.put("/links/:id", auth, linkController.updateLink);
router.delete("/links/:id", auth, linkController.deleteLink);
router.get("/dashboard", auth, getDashboardStats);

// router.get("/", auth, linkController.getInfo);

// router.get("/:shortUrl", auth, linkController.redirectToOriginal);

module.exports = router;
