import { AppError } from './errorHandler.js';
import UserModel from '../models/user.model.js';

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles for the route
 */
export const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return next(new AppError('Authentication required', 401));
      }

      // Get user from database to check role
      const user = await UserModel.findById(req.userId).select('role status');

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // Check if user account is active
      if (user.status !== 'Active') {
        return next(new AppError('Account is not active', 403));
      }

      // Check if user has required role
      if (roles.length && !roles.includes(user.role)) {
        return next(new AppError('Insufficient permissions', 403));
      }

      // Attach user role to request
      req.userRole = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Admin only authorization
 */
export const adminOnly = authorize('ADMIN');

/**
 * Check if user owns the resource or is admin
 */
export const ownerOrAdmin = (resourceUserIdField = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return next(new AppError('Authentication required', 401));
      }

      const user = await UserModel.findById(req.userId).select('role');

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // Admin can access any resource
      if (user.role === 'ADMIN') {
        req.userRole = user.role;
        return next();
      }

      // Check if user owns the resource
      const resourceUserId = req.body[resourceUserIdField] ||
                            req.params[resourceUserIdField] ||
                            req.query[resourceUserIdField];

      if (resourceUserId && resourceUserId.toString() === req.userId.toString()) {
        req.userRole = user.role;
        return next();
      }

      return next(new AppError('Access denied', 403));
    } catch (error) {
      next(error);
    }
  };
};
