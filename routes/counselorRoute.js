const express = require("express");
const router = express.Router();
const CounselorController = require("../controllers/counselorController");
const authorization = require("../middlewares/authorization");
const { avatarStorage } = require("../middlewares/aws");
const { uploadAvatar } = require("../middlewares/multer");

router.get("/", CounselorController.getCounselor);

router.get("/:id", CounselorController.getCounselorById);

router.post(
  "/",
  uploadAvatar.single("avatar_url"),
  avatarStorage,
  authorization,
  CounselorController.createCounselor
);

router.put("/:id", authorization, CounselorController.updateCounselor);

module.exports = router;
