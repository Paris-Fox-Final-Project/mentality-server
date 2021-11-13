const express = require("express");
const errorHandler = require("../middlewares/errorHandler.js");
const userController = require("../controllers/controllerUser.js");
const authentication = require("../middlewares/authentication.js");
const counselingRouter = require("./counselingRouter.js");
const router = express.Router();
const counselor = require("./counselorRoute");
const userRouter = require("./userRouter.js");
const topicRouter = require("./topicRouter.js");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/admin/register", userController.registerAdmin);
router.post("/admin/login", userController.loginAdmin);
router.use(authentication);
router.use("/counseling", counselingRouter);
router.use("/counselors", counselor);
router.use("/users", userRouter);
router.use(topicRouter);
router.use(errorHandler);

module.exports = router;
