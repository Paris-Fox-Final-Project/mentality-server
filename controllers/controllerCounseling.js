const { CounselorUser, Counselor, User } = require("../models");
const moment = require("moment");
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
          name: "COUNSELOR_NOT_FOUND",
        };
      }
      const transactionAmount = counselor.price * Number(totalSession);
      const counseling = await CounselorUser.create({
        TopicId,
        description,
        UserId,
        schedule,
        CounselorId,
        totalSession,
        transactionAmount,
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

  static async changeDoneStatusCounseling(req, res, next) {
    const { counselingId } = req.params;

    try {
      const counseling = await CounselorUser.findByPk(counselingId);
      if (!counseling) {
        throw {
          name: "COUNSELING_NOT_FOUND",
        };
      }

      if (!counseling.isPaid) {
        throw {
          name: "COUNSELING_NOT_PAID",
        };
      }

      const schedule = Date.parse(counseling.schedule);
      const today = Date.parse(new Date().toLocaleString());
      if (schedule > today) {
        throw {
          name: "COUNSELING_NOT_START",
        };
      }
      const [_, [counselingUpdated]] = await CounselorUser.update(
        { isDone: true },
        { where: { id: counseling.id }, returning: true }
      );
      res.status(200).json({
        counseling: counselingUpdated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCounselorCounselingList(req,res,next){
    try {
      const { counselorId } = req.params;
      const counselingLists = await CounselorUser.findAll({
        where:{
          CounselorId: counselorId
        }
      })
      res.status(200).json(counselingLists)
    } catch (err) {
      console.log(err, 'get all counselor counseling liset')
      next(err)
    }
  }

  static async getAllUserCounselingList(req,res,next){
    try {
      const { userId } = req.params;
      const counselingLists = await CounselorUser.findAll({
        where:{
          UserId: userId
        }
      })
      res.status(200).json(counselingLists)
    } catch (err) {
      console.log(err, 'get all user counseling liset')
      next(err)
    }
  }

  static async getCounselingDetail(req,res,next){
    try {
      const { counselingId } = req.params;
      console.log('masuk sini')
      const counselingDetail = await CounselorUser.findByPk(counselingId,{
        include: {
          model: User,
          attributes: {
            exclude: ["password","createdAt","updatedAt"]
          }
        }
      })
      if(!counselingDetail){
        throw {name: "COUNSELING_NOT_FOUND"}
      }
      res.status(200).json(counselingDetail)
    } catch (err) {
      next(err)
    }
  }
  // disini
}

module.exports = CounselingController;
