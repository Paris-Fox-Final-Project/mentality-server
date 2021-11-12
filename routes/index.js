const express = require("express");
const errorHandler = require("../middlewares/errorHandler.js")
const userController = require("../controllers/controllerUser.js")
const TopicController = require('../controllers/TopicController');
const authentication = require("../middlewares/authentication.js")
const authorization = require("../middlewares/authorization.js")
const router = express.Router();

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/admin/register", userController.registerAdmin)
router.post("/admin/login", userController.loginAdmin)

// topics
router.get('/', TopicController.getItem);
router.get('/:id', TopicController.getItemById);
router.post('/', TopicController.postItem);
router.put('/:id', TopicController.putItem);
router.delete('/:id', TopicController.deleteItem);

router.use(errorHandler)

module.exports = router;
