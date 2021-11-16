const { CounselorUser, Counselor, User,Topic, sequelize } = require("../models");
const sha512 = require("js-sha512");
const { nanoid } = require("nanoid");
const createMidtransTransaction = require("../helpers/midtrans");
class CounselingController {
  static async createCounseling(req, res, next) {
    const { CounselorId, TopicId, description, schedule, totalSession } =
      req.body;
    const { id: UserId, email: userEmail, name: userName } = req.user;
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
      const orderId = nanoid();
      console.log(orderId, ">>>>>> order id");
      const counseling = await CounselorUser.create({
        TopicId,
        description,
        UserId,
        schedule,
        CounselorId,
        totalSession,
        transactionAmount,
        orderId,
      });

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: counseling.transactionAmount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: userName,
          email: userEmail,
        },
      };

      const transaction = await createMidtransTransaction(parameter);
      res.status(201).json({
        counseling: {
          ...counseling.toJSON(),
          Counselor: { ...counselor.toJSON() },
          transaction: {
            ...transaction,
            orderId: orderId,
          },
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

  static async changeStatusPaid(req, res, next) {
    const {
      signature_key,
      status_code,
      order_id,
      gross_amount,
      transaction_status,
    } = req.body;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const dbTransaction = await sequelize.transaction();
    try {
      const stringForHash = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const hash = await sha512(stringForHash);

      if (hash !== signature_key) {
        throw {
          name: "MIDTRANS_SIGNATURE_ERROR",
        };
      }
      const successStatus = ["settlement", "capture"];
      const isSuccess = successStatus.includes(transaction_status);

      if (!isSuccess) {
        console.log("masuk ke sini gk nich?")
        // tambahin destroy counselorUser
        await CounselorUser.destroy({
          where: {
            orderId: order_id
          },
          transaction: dbTransaction,
        })
        await dbTransaction.commit();
        res.status(200).json({ status: "OK" });
        return
      } else {
        const options = {
          where: { orderId: order_id },
          transaction: dbTransaction,
        };
        await CounselorUser.update({ isPaid: true }, options);
        await dbTransaction.commit();
        res.status(200).json({
          status: "success",
        });
      }
    } catch (error) {
      await dbTransaction.rollback();
      next(error);
    }
  }
  static async getAllCounselorCounselingList(req, res, next) {
    try {
      const { counselorId } = req.params;
      const counselingLists = await CounselorUser.findAll({
        include: {
          model: User,
          attributes:{
            exclue: ["password","createdAt","updatedAt"]
          }
        },
        where: {
          CounselorId: counselorId,
        },
      });
      res.status(200).json(counselingLists);
    } catch (err) {
      next(err);
    }
  }

  static async getAllUserCounselingList(req, res, next) {
    try {
      const { userId } = req.params;

      const counselingLists = await CounselorUser.findAll({
        where: {
          UserId: userId,
        },
      });
      res.status(200).json(counselingLists);
    } catch (err) {
      next(err);
    }
  }

  static async getCounselingDetail(req, res, next) {
    try {
      const { counselingId } = req.params;
      const counselingDetail = await CounselorUser.findByPk(counselingId, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },{
            model: Topic,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            }
          }
        ]
      });
      if (!counselingDetail) {
        throw { name: "COUNSELING_NOT_FOUND" };
      }
      res.status(200).json(counselingDetail);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CounselingController;
