const { Review } = require("../models");

class ReviewController {
    static async createReview(req,res,next){
        try {
            const {CounselorId, UserId, message} = req.body
            const create = await Review.create({
                CounselorId: CounselorId,
                UserId: UserId,
                message: message
            })
            res.status(201).json(create)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ReviewController;
