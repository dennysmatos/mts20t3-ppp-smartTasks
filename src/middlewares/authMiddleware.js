const userRepository = require("../repositories/userRepository");
const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwtHelper");

async function authMiddleware(request, _response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new AppError("Authentication token is required", 401);
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authentication token", 401);
    }

    const decodedToken = verifyToken(token);
    const user = await userRepository.findById(decodedToken.sub);

    if (!user) {
      throw new AppError("Invalid authentication token", 401);
    }

    request.user = {
      id: user.id,
      email: user.email
    };

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Invalid authentication token", 401));
    }

    return next(error);
  }
}

module.exports = authMiddleware;

