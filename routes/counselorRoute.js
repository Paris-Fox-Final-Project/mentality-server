const express = require("express");
const router = express.Router();
const CounselorController = require("../controllers/counselorController")
const authorization = require("../middlewares/authorization")

router.get('/', CounselorController.getCounselor)

router.get('/:id', CounselorController.getCounselorById)

router.post('/', authorization,CounselorController.createCounselor)

router.put('/:id', authorization,CounselorController.updateCounselor)

module.exports = router;