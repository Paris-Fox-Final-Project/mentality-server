const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY)
}

function checkToken(token) {
  return jwt.verify(token, SECRET_KEY)
}

module.exports = { generateToken, checkToken }