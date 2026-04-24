const authService = require("../services/authService");

async function login(request, response, next) {
  try {
    const authData = await authService.login(request.body);

    return response.status(200).json({
      message: "Login successful",
      data: authData
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login
};

