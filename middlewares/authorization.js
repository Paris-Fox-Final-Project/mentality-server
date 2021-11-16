const authorization = async (req, res, next) => {
  try {
    const authUser = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }

    if (authUser.role === "admin") {
      next()
    } else { // ini belom ada
      throw { name: "FORBIDDEN_ACCESS" } 
    }
    
  } catch (err) {
    next(err)
  }
}

module.exports = authorization