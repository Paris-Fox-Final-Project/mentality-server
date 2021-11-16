const { Router } = require("express");
const router = Router();
const ReviewController = require("../controllers/reviewController")

router.post("/", ReviewController.createReview);

module.exports = router;