const { Counselor, User } = require("../models");

class CounselorController {
  static async getCounselor(req, res, next) {
    try {
      const counselors = await Counselor.findAll({ include: [{ model: User }] });
      res.status(200).json(counselors);
    } catch (err) {
      next(err);
    }
  }

  static async getCounselorById(req, res, next) {
    try {
      const { id } = req.params;

      const counselor = await Counselor.findOne({
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
        where: {
          id: id,
        },
      });
      if (!counselor) {
        throw { name: "COUNSELOR_NOT_FOUND" };
      }
      res.status(200).json(counselor);
    } catch (err) {
      next(err);
    }
  }

  static async createCounselor(req, res, next) {
    const avatarUrl = req.avatarUrl;
    try {
      const { email, password, name, gender, motto, specialist, about, price } = req.body;

      const createdUserCounselor = await User.create({
        email: email,
        password: password,
        role: "counselor",
        name: name,
        gender: gender,
        avatarUrl: avatarUrl,
      });

      const createdCounselor = await Counselor.create({
        UserId: createdUserCounselor.id,
        motto: motto,
        specialist: specialist,
        about: about,
        price: price,
      });
      const payload = {
        id: createdUserCounselor.id,
        email: createdUserCounselor.email,
        role: createdUserCounselor.role,
        name: createdUserCounselor.name,
        gender: createdUserCounselor.gender,
        avatarUrl: createdUserCounselor.avatarUrl,
        motto: createdCounselor.module,
        specialist: createdCounselor.specialist,
        about: createdCounselor.about,
        price: createdCounselor.price,
      };
      res.status(201).json({
        counselor: payload,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateCounselor(req, res, next) {
    try {
      const { motto, specialist, about, price } = req.body;
      const { id } = req.params;
      const updated = await Counselor.update(
        {
          motto: motto,
          specialist: specialist,
          about: about,
          price: price,
        },
        {
          where: {
            UserId: id,
          },
        }
      );
      res.status(200).json({ message: "Counselor Updated" });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = CounselorController;
