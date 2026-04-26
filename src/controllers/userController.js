import * as userService from '../services/userService.js';

async function create(request, response, next) {
  try {
    const user = await userService.createUser(request.body);

    return response.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAuthenticatedUser(request, response, next) {
  try {
    const user = await userService.getUserById(request.user.id);

    return response.status(200).json({
      message: 'Authenticated user retrieved successfully',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

export { create, getAuthenticatedUser };
