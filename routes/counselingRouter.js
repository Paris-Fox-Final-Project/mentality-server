const { Router } = require("express");
const CounselingController = require("../controllers/controllerCounseling");
const counselingRouter = Router();
counselingRouter.post("/", CounselingController.createCounseling);
counselingRouter.patch(
  "/:counselingId/done",
  CounselingController.changeDoneStatusCounseling
);
counselingRouter.get("/:counselingId", CounselingController.getCounselingDetail)
counselingRouter.get("/counselor/:counselorId", CounselingController.getAllCounselorCounselingList)
counselingRouter.get("/user/:userId", CounselingController.getAllUserCounselingList)

module.exports = counselingRouter;
