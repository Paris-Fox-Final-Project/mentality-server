const { CounselorUser, Counselor, User } = require("../models");
class CounselingController {
  static async createCounseling(req, res, next) {
    const { CounselorId, TopicId, description, schedule, totalSession } =
      req.body;
    const { id: UserId } = req.user;
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
        totalSession,
        transactionAmount: counselor.price * totalSession,
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
