const { Router } = require("express");
const CounselingController = require("../controllers/controllerCounseling");
const counselingRouter = Router();
counselingRouter.post("/", CounselingController.createCounseling);
counselingRouter.patch(
  "/:counselingId/done",
  CounselingController.changeDoneStatusCounseling
);

module.exports = counselingRouter;
