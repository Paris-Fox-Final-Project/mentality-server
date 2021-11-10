const errorHandler = async (err, req, res, next) => {
  switch(err.name) {
    case 'SequelizeUniqueConstraintError':
      res.status(400).json({ message: err.message })
      break;
    case 'SequelizeValidationError':
      const message = err.errors.map((error) => error.message)
      res.status(400).json({ message })
      break;
    case 'UNAUTHORIZED_LOGIN':
      res.status(401).json({ message: 'Invalid Email/Password' })
      break;
    default:
      res.status(500).json({ message: 'Internal Server Error' })
      break;
  }
}

module.exports = errorHandler