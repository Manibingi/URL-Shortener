const express = require("express");
// const Auth = require('../middlewares/AuthMiddleware');
const { redirectUrl } = require("../Controllers/url.controller");

const router = express.Router();

router.get("/:shorted", redirectUrl);

module.exports = router;
