const bcrypt = require('bcrypt')

function encodePassword(password) {
  const salt = bcrypt.genSaltSync(12)
  return bcrypt.hashSync(password, salt)
}

function decodePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword)
}

module.exports = { encodePassword, decodePassword }