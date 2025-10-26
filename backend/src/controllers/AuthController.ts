import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { AuthService } from '../services/AuthService';
import { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '../types';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phone, role }: RegisterRequest = req.body;

      // Validate input
      if (!name || !email || !password || !phone || !role) {
        const response: ApiResponse = {
          success: false,
          message: 'All fields are required',
          error: 'MISSING_FIELDS'
        };
        res.status(400).json(response);
        return;
      }

      // Validate email format
      if (!AuthService.validateEmail(email)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid email format',
          error: 'INVALID_EMAIL'
        };
        res.status(400).json(response);
        return;
      }

      // Validate phone format
      if (!AuthService.validatePhone(phone)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid phone number format',
          error: 'INVALID_PHONE'
        };
        res.status(400).json(response);
        return;
      }

      // Validate password strength
      const passwordValidation = AuthService.validatePassword(password);
      if (!passwordValidation.isValid) {
        const response: ApiResponse = {
          success: false,
          message: 'Password does not meet requirements',
          error: 'WEAK_PASSWORD',
          data: passwordValidation.errors
        };
        res.status(400).json(response);
        return;
      }

      // Validate role
      if (!['customer', 'expert'].includes(role)) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid role',
          error: 'INVALID_ROLE'
        };
        res.status(400).json(response);
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          message: 'User already exists with this email',
          error: 'USER_EXISTS'
        };
        res.status(409).json(response);
        return;
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(password);

      // Create user
      const user = await UserModel.create({
        name,
        email,
        password_hash: hashedPassword,
        phone,
        role
      });

      // Generate auth response
      const authResponse: AuthResponse = AuthService.generateAuthResponse(user);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: 'User registered successfully',
        data: authResponse
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Registration failed',
        error: 'REGISTRATION_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validate input
      if (!email || !password) {
        const response: ApiResponse = {
          success: false,
          message: 'Email and password are required',
          error: 'MISSING_CREDENTIALS'
        };
        res.status(400).json(response);
        return;
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid credentials',
          error: 'INVALID_CREDENTIALS'
        };
        res.status(401).json(response);
        return;
      }

      // Verify password
      const isPasswordValid = await AuthService.verifyPassword(password, user.password_hash || '');
      if (!isPasswordValid) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid credentials',
          error: 'INVALID_CREDENTIALS'
        };
        res.status(401).json(response);
        return;
      }

      // Update last login
      await UserModel.updateProfile(user.id, { lastLogin: new Date().toISOString() } as any);

      // Generate auth response
      const authResponse: AuthResponse = AuthService.generateAuthResponse(user);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: 'Login successful',
        data: authResponse
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Login failed',
        error: 'LOGIN_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          message: 'Refresh token is required',
          error: 'MISSING_REFRESH_TOKEN'
        };
        res.status(400).json(response);
        return;
      }

      // Verify refresh token
      const payload = AuthService.verifyToken(refreshToken);
      
      // Get user
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        };
        res.status(401).json(response);
        return;
      }

      // Generate new tokens
      const authResponse: AuthResponse = AuthService.generateAuthResponse(user);

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: 'Token refreshed successfully',
        data: authResponse
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Refresh token error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Token refresh failed',
        error: 'TOKEN_REFRESH_FAILED'
      };
      res.status(401).json(response);
    }
  }

  // Logout user
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real app, you might want to blacklist the token
      // For now, we'll just return success
      const response: ApiResponse = {
        success: true,
        message: 'Logout successful'
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Logout error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Logout failed',
        error: 'LOGOUT_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'NOT_AUTHENTICATED'
        };
        res.status(401).json(response);
        return;
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get profile error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve profile',
        error: 'PROFILE_RETRIEVAL_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const updates = req.body;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'NOT_AUTHENTICATED'
        };
        res.status(401).json(response);
        return;
      }

      // Remove sensitive fields
      delete updates.password;
      delete updates.password_hash;
      delete updates.id;

      const user = await UserModel.updateProfile(userId, updates);

      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: user
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update profile error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update profile',
        error: 'PROFILE_UPDATE_FAILED'
      };
      res.status(500).json(response);
    }
  }
}
