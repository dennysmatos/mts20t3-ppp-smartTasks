const userService = require("../services/userService");

async function create(request, response, next) {
  try {
    const user = await userService.createUser(request.body);

    return response.status(201).json({
      message: "User created successfully",
      data: user
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create
};

