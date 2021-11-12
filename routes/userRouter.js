const { Router } = require("express");
const UserController = require("../controllers/controllerUser");
const userRouter = Router();

userRouter.get("/:userId", UserController.getUserById);

module.exports = userRouter;
