const { User } = require('../models/index.js')
const { decodePassword } = require('../helpers/bcrypt.js')
const { generateToken } = require('../helpers/jwt.js')

class UserController {
  static async register (req, res, next) {
    try {
      const dataUser = {
        email: req.body.email,
        password: req.body.password,
        role: 'user',
        name: req.body.name,
        gender: req.body.gender,
        avatarUrl: req.body.avatarUrl
      }

      const newUser = await User.create(dataUser)
      res.status(201).json({ 
        id: newUser.id, 
        email: newUser.email 
      })
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
          const access_token = generateToken({ 
            id: selectedUser.id, 
            email: selectedUser.email, 
            role: selectedUser.role 
          })
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
      const dataAdmin = {
        email: req.body.email,
        password: req.body.password,
        role: "admin",
        name: req.body.name,
        gender: req.body.gender,
        avatarUrl: req.body.avatarUrl
      }

      const newAdmin = await User.create(dataAdmin)
      res.status(201).json({ 
        id: newAdmin.id, 
        email: newAdmin.email 
      })
    } catch (err) {
      next(err)
    }
  }
  
  static async loginAdmin (req, res, next) {
    try {
      const { email, password } = req.body

      const selectedAdmin = await User.findOne({ where: { email }})
      if (selectedAdmin) {
        if (selectedAdmin.role === "admin") {
          const isAdminPassExist = decodePassword(password, selectedAdmin.password)
          if (isAdminPassExist) {
            const access_token = generateToken({ 
              id: selectedAdmin.id, 
              email: selectedAdmin.email, 
              role: selectedAdmin.role 
            })
          res.status(200).json({ access_token })
          } else {
            throw { name: 'UNAUTHORIZED_LOGIN' }
          }
        } else {
          throw { name: 'UNAUTHORIZED_ROLE' }
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