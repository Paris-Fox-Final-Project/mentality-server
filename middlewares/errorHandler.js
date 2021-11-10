const errorHandler = async (err, req, res, next) => {
  switch(err.name) {
    case 'SequelizeUniqueConstraintError':
      res.status(400).json({ message: err.message })
      break;
    case 'SequelizeValidationError':
      const message = err.errors.map((error) => error.message)
      res.status(400).json({ message })
      break;
    case 'JsonWebTokenError':
      res.status(401).json({ message: 'Invalid Access Token' })
      break;
    case 'REQUIRED_TOKEN':
      res.status(401).json({ message: 'Access Token is required' })
      break;
    case 'UNAUTHORIZED_LOGIN':
      res.status(401).json({ message: 'Invalid Email/Password' })
      break;    
    case 'UNAUTHORIZED_ACCESS':
      res.status(401).json({ message: 'Authentication is failed' })
      break;
    case 'FORBIDDEN_ACCESS':
      res.status(403).json({ message: 'Access Feature is forbidden' })
      break;
    case 'NOTFOUND_CATEGORY':
      res.status(404).json({ message: 'Category is not found' })
      break;
    case 'NOTFOUND_POST':
      res.status(404).json({ message: 'Post is not found' })
      break;
    case 'NOTFOUND_USER':
      res.status(404).json({ message: 'User is not found' })
      break;
    case 'NOTFOUND_FAVORITE':
      res.status(404).json({ message: 'Data Favorite is not found' })
      break;
    case 'MISSING_FILE':
      res.status(404).json({ message: 'File is not found' })
      break;
    default:
      res.status(500).json({ message: 'Internal Server Error' })
      break;
  }
}

module.exports = errorHandler