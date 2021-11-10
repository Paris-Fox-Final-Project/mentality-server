const express = require("express");
const errorHandler = require("../middlewares/errorHandler.js")
const userController = require("../controllers/controllerUser.js")
const authentication = require("../middlewares/authentication.js")
const authorization = require("../middlewares/authorization.js")
const router = express.Router();

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/admin/register", userController.registerAdmin)
router.post("/admin/login", userController.loginAdmin)

router.use(errorHandler)

module.exports = router;
