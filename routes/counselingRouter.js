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
//disini
// GET /counseling/counselor/:counselorId => Dapatkan seluruh list counseling dari seorang counselor by counselorId
// GET /counseling/:counselingId => Dapatkan detail conseling
// GET /counseling/user/:userId => Dapatkan seluruh list counseling dari seorang patient by userId 

module.exports = counselingRouter;
