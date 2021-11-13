const errorHandler = async (err, req, res, next) => {
  switch (err.name) {
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.message });
      break;
    case "SequelizeValidationError":
      const message = err.errors.map((error) => error.message);
      res.status(400).json({ message });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid Access Token" });
      break;
    case "REQUIRED_TOKEN":
      res.status(401).json({ message: "Access Token is Required" });
      break;
    case "UNAUTHORIZED_LOGIN":
      res.status(401).json({ message: "Invalid Email/Password" });
      break;
    case "UNAUTHORIZED_ROLE":
      res.status(401).json({ message: "Invalid Role Authentication" });
      break;
    case "UNAUTHORIZED_ACCESS":
      res.status(401).json({ message: "Authentication is Failed" });
      break;
    case "FORBIDDEN_ACCESS":
      res.status(403).json({ message: "Access Feature is Forbidden" });
      break;
    case "COUNSELOR_NOT_FOUND":
      res.status(404).json({ message: "Counselor not found!" });
      break;
    case "FORBIDDEN_ACCESS":
      res.status(403).json({ message: "Access Feature is Forbidden" });
      break;
    case "COUNSELING_NOT_START":
      res.status(400).json({ message: "Sorry, counseling hasn't started yet" });
      break;
    case "COUNSELING_NOT_FOUND":
      res.status(404).json({ message: "Counseling Not Found" });
      break;
    case "COUNSELING_NOT_PAID":
      res
        .status(400)
        .json({ message: "Sorry, counseling hasn't not paid yet" });
      break;
    case "USER_NOT_FOUND":
      res.status(404).json({ message: "User not found" });
      break;
    default:
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = errorHandler;
