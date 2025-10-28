import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware, ValidationMiddleware } from '../middleware/AuthMiddleware';
import Joi from 'joi';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().min(10).max(15).required(),
  role: Joi.string().valid('customer', 'expert').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

// Public routes
router.post('/register', 
  ValidationMiddleware.validateRequest(registerSchema),
  AuthController.register
);

router.post('/login', 
  ValidationMiddleware.validateRequest(loginSchema),
  AuthController.login
);

router.post('/refresh-token', 
  ValidationMiddleware.validateRequest(refreshTokenSchema),
  AuthController.refreshToken
);

// Protected routes
router.post('/logout', 
  AuthMiddleware.authenticate,
  AuthController.logout
);

router.get('/profile', 
  AuthMiddleware.authenticate,
  AuthController.getProfile
);

router.put('/profile', 
  AuthMiddleware.authenticate,
  AuthController.updateProfile
);

export default router;
