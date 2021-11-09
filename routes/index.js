const express = require("express");
const topicsRoute = require('./topics');
const router = express.Router();

router.use("/topics", topicsRoute);

module.exports = router;
