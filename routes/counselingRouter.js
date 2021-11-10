const { Router } = require("express");
const CounselingController = require("../controllers/CounselingController");
const counselingRouter = Router();

counselingRouter.post("/", CounselingController.createCounseling);

module.exports = counselingRouter;
