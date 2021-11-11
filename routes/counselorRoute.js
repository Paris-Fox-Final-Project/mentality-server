const express = require("express");
const router = express.Router();
const CounselorController = require("../controllers/counselorController")

router.get('/', CounselorController.getCounselor)

router.get('/:id', CounselorController.getCounselorById)

router.post('/', CounselorController.createCounselor)

router.put('/:id', CounselorController.updateCounselor)

module.exports = router;