const {Router} = require("express")
const VideocallController = require("../controllers/videocallController")
const videocallRouter = Router()


videocallRouter.post("/rooms", VideocallController.createRoom)
// videocallRouter.get("/rooms/:name", VideocallController.joinRoom)

module.exports = videocallRouter