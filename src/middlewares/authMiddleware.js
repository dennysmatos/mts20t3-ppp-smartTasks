import * as userRepository from '../repositories/userRepository.js';
import AppError from '../utils/AppError.js';
import { verifyToken } from '../utils/jwtHelper.js';

async function authMiddleware(request, _response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new AppError('Token de autenticação é obrigatório', 401);
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Token de autenticação inválido', 401);
    }

    const decodedToken = verifyToken(token);
    const user = await userRepository.findById(decodedToken.sub);

    if (!user) {
      throw new AppError('Token de autenticação inválido', 401);
    }

    request.user = {
      id: user.id,
      email: user.email,
    };

    return next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return next(new AppError('Token de autenticação inválido', 401));
    }

    return next(error);
  }
}

export default authMiddleware;
