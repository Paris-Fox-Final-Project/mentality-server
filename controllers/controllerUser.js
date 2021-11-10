const { User } = require('../models/index.js')
const { decodePassword } = require('../helpers/bcrypt.js')
const { generateToken } = require('../helpers/jwt.js')

class UserController {
  static async register (req, res, next) {
    try {
      const dataUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: 'user',
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
      }

      const newUser = await User.create(dataUser)
      res.status(201).json({ id: newUser.id, email: newUser.email })
    } catch (err) {
      next(err)
    }
  }
  
  static async login (req, res, next) {
    try {
      const { email, password } = req.body

      const selectedUser = await User.findOne({ where: { email }})
      if (selectedUser) {
        const isUserPassExist = decodePassword(password, selectedUser.password)
        if (isUserPassExist) {
          const access_token = generateToken({ id: selectedUser.id, email: selectedUser.email, role: selectedUser.role })
          res.status(200).json({ access_token })
        } else {
          throw { name: 'UNAUTHORIZED_LOGIN' }
        }
      } else {
        throw { name: 'UNAUTHORIZED_LOGIN' }
      }
    } catch (err) {
      next(err)
    }
  }
  
  static async registerAdmin (req, res, next) {
    try {
      const dataUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: 'admin',
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
      }

      const newUser = await User.create(dataUser)
      res.status(201).json({ id: newUser.id, email: newUser.email })
    } catch (err) {
      next(err)
    }
  }
  
  static async loginAdmin (req, res, next) {
    try {
      const { email, password } = req.body

      const selectedUser = await User.findOne({ where: { email }})
      if (selectedUser) {
        const isUserPassExist = decodePassword(password, selectedUser.password)
        if (isUserPassExist) {
          const access_token = generateToken({ id: selectedUser.id, email: selectedUser.email, role: selectedUser.role })
          res.status(200).json({ access_token })
        } else {
          throw { name: 'UNAUTHORIZED_LOGIN' }
        }
      } else {
        throw { name: 'UNAUTHORIZED_LOGIN' }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController