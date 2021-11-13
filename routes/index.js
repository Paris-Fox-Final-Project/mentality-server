const express = require("express");
const errorHandler = require("../middlewares/errorHandler.js");
const userController = require("../controllers/controllerUser.js");
const authentication = require("../middlewares/authentication.js");
const counselingRouter = require("./counselingRouter.js");
const router = express.Router();
const counselor = require("./counselorRoute");
const userRouter = require("./userRouter.js");
const topicRouter = require("./topicRouter.js");
const { uploadAvatar } = require("../middlewares/multer.js");
const { avatarStorage } = require("../middlewares/aws.js");
const CounselingController = require("../controllers/controllerCounseling.js");
router.post(
  "/register",
  uploadAvatar.single("avatar_url"),
  avatarStorage,
  userController.register
);
router.post("/login", userController.login);
router.post("/admin/register", userController.registerAdmin);
router.post("/admin/login", userController.loginAdmin);
router.post(
  "/counseling/midtrans/notification",
  CounselingController.changeStatusPaid
);
router.use(authentication);
router.use("/counseling", counselingRouter);
router.use("/counselors", counselor);
router.use("/users", userRouter);
router.use(topicRouter);
router.use(errorHandler);

module.exports = router;
