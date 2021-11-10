const { CounselorUser, Counselor, User } = require("../models");
class CounselingController {
  static async createCounseling(req, res, next) {
    const { CounselorId, TopicId, description, schedule, session } = req.body;
    const UserId = 1;
    try {
      const counselor = await Counselor.findByPk(CounselorId, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
      });

      if (!counselor) {
        throw {
          name: "Counselor Not Found",
        };
      }

      const counseling = await CounselorUser.create({
        TopicId,
        description,
        UserId,
        schedule,
        CounselorId,
        transactionAmount: counselor.price * session,
      });

      res.status(201).json({
        counseling: {
          ...counseling.toJSON(),
          Counselor: { ...counselor.toJSON() },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CounselingController;
