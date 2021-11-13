const { Router } = require("express");
const UserController = require("../controllers/controllerUser");
const { avatarStorage } = require("../middlewares/aws");
const { uploadAvatar } = require("../middlewares/multer");
const userRouter = Router();

userRouter.get("/:userId", UserController.getUserById);
userRouter.put(
  "/:userId",
  uploadAvatar.single("avatar_url"),
  avatarStorage,
  UserController.editDataUserById
);
module.exports = userRouter;
