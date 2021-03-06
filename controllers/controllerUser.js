const { User, Counselor } = require("../models/index.js");
const { decodePassword } = require("../helpers/bcrypt.js");
const { generateToken } = require("../helpers/jwt.js");

class UserController {
  static async register(req, res, next) {
    const avatarUrl = req.avatarUrl;
    try {
      const dataUser = {
        email: req.body.email,
        password: req.body.password,
        role: "user",
        name: req.body.name,
        gender: req.body.gender,
        avatarUrl: avatarUrl,
      };

      const newUser = await User.create(dataUser);
      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const selectedUser = await User.findOne({ where: { email } });
      if (selectedUser) {
        const isUserPassExist = decodePassword(password, selectedUser.password);
        if (isUserPassExist) {
          const payload = {
            id: selectedUser.id,
            email: selectedUser.email,
            role: selectedUser.role,
            name: selectedUser.name,
          };
          const access_token = generateToken(payload);
          if (payload.role === "counselor") {
            const counselor = await Counselor.findOne({
              where: {
                UserId: payload.id,
              },
            });
            res.status(200).json({
              user: {
                ...selectedUser.toJSON(),
                Counselor: {
                  ...counselor.toJSON(),
                },
              },
              access_token: access_token,
            });
          } else {
            res.status(200).json({ user: payload, access_token: access_token });
          }
        } else {
          throw { name: "UNAUTHORIZED_LOGIN" };
        }
      } else {
        throw { name: "UNAUTHORIZED_LOGIN" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async registerAdmin(req, res, next) {
    try {
      const dataAdmin = {
        email: req.body.email,
        password: req.body.password,
        role: "admin",
        name: req.body.name,
        gender: req.body.gender,
        avatarUrl: req.body.avatarUrl,
      };

      const newAdmin = await User.create(dataAdmin);
      res.status(201).json({
        id: newAdmin.id,
        email: newAdmin.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;

      const selectedAdmin = await User.findOne({ where: { email } });
      if (selectedAdmin) {
        if (selectedAdmin.role === "admin") {
          const isAdminPassExist = decodePassword(
            password,
            selectedAdmin.password
          );
          if (isAdminPassExist) {
            const access_token = generateToken({
              id: selectedAdmin.id,
              email: selectedAdmin.email,
              role: selectedAdmin.role,
            });
            res.status(200).json({ access_token });
          } else {
            throw { name: "UNAUTHORIZED_LOGIN" };
          }
        } else {
          throw { name: "UNAUTHORIZED_ROLE" };
        }
      } else {
        throw { name: "UNAUTHORIZED_LOGIN" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });

      if (!user) {
        throw {
          name: "USER_NOT_FOUND",
        };
      }
      res.status(200).json({
        user: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async editDataUserById(req, res, next) {
    const { userId } = req.params;
    const { name, gender } = req.body;
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw {
          name: "USER_NOT_FOUND",
        };
      }

      const avatarUrl = req.avatarUrl ? req.avatarUrl : user.avatarUrl;
      const payload = {
        name,
        gender,
        avatarUrl,
      };

      const [_, [userUpdated]] = await User.update(payload, {
        where: {
          id: userId,
        },
        returning: true,
      });
      const dataResponse = {
        id: userUpdated.id,
        name: userUpdated.name,
        role: userUpdated.role,
        gender: userUpdated.gender,
        avatarUrl: userUpdated.avatarUrl,
        email: userUpdated.email,
      };
      res.status(200).json({ user: dataResponse });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
