const errorHandler = async (err, req, res, next) => {
  const { name } = err;
  let message = "Internal Server Error";
  let code = 500;
  switch (name) {
    case "SequelizeUniqueConstraintError":
      code = 400;
      message = err.message;
      break;
    case "SequelizeValidationError":
      code = 400;
      message = err.errors.map((error) => error.message);
      break;
    case "JsonWebTokenError":
      code = 401;
      message = "Invalid Access Token";
      break;
    case "REQUIRED_TOKEN":
      code = 401;
      message = "Access Token is Required";
      break;
    case "UNAUTHORIZED_LOGIN":
      code = 401;
      message = "Invalid Email/Password";
      break;
    case "UNAUTHORIZED_ROLE":
      code = 401;
      message = "Invalid Role Authentication";
      break;
    case "UNAUTHORIZED_ACCESS":
      code = 401;
      message = "Authentication is Failed";
      break;
    case "FORBIDDEN_ACCESS":
      code = 403;
      message = "Access Feature is Forbidden";
      break;
    case "COUNSELOR_NOT_FOUND":
      code = 404;
      message = "Counselor not found!";
      break;
    case "FORBIDDEN_ACCESS":
      code = 403;
      message = "Access Feature is Forbidden";
      break;
    case "COUNSELING_NOT_START":
      code = 400;
      message = "Sorry, counseling hasn't started yet";
      break;
    case "COUNSELING_NOT_FOUND":
      code = 404;
      message = "Counseling Not Found";
      break;
    case "COUNSELING_NOT_PAID":
      code = 400;
      message = "Sorry, counseling hasn't not paid yet";
      break;
    case "USER_NOT_FOUND":
      code = 404;
      message = "User not found";
      break;
    case "MIDTRANS_SIGNATURE_ERROR":
      code = 400;
      message = "Failed Signature Key";
      break;
    case "TOPIC_NOT_FOUND":
      code = 404;
      message = "Topic not found";
      break;
    default:
      break;
  }
  res.status(code).json({ message });
};

module.exports = errorHandler;
