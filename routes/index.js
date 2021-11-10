const express = require("express");
const counselingRouter = require("./counselingRouter");
const router = express.Router();

router.use("/counseling", counselingRouter);
module.exports = router;
