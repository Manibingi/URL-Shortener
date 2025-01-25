const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/user.middleware");
const linkController = require("../Controllers/url.controller");

// Routes
router.post("/links", auth, linkController.shortenUrl);
router.get("/links", auth, linkController.getAllLinks);
router.get("/links/:id", auth, linkController.getLinkById);
router.put("/links/:id", auth, linkController.updateLink);
router.delete("/links/:id", auth, linkController.deleteLink);

// router.get("/:shortUrl", auth, linkController.redirectToOriginal);

module.exports = router;
