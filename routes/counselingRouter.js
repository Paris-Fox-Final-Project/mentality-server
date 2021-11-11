const { Router } = require("express");
const CounselingController = require("../controllers/controllerCounseling");
const counselingRouter = Router();

counselingRouter.post("/", CounselingController.createCounseling);

module.exports = counselingRouter;
