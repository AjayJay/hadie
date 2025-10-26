import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserModel } from '../models/UserModel';
import { ApiResponse, JWTPayload } from '../types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  // Authenticate JWT token
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response: ApiResponse = {
          success: false,
          message: 'Access token required',
          error: 'MISSING_TOKEN'
        };
        res.status(401).json(response);
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      try {
        const payload = AuthService.verifyToken(token);
        
        // Verify user still exists
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

        req.user = payload;
        next();
      } catch (error) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid or expired token',
          error: 'INVALID_TOKEN'
        };
        res.status(401).json(response);
        return;
      }
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication failed',
        error: 'AUTH_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Check if user has specific role
  static requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          message: 'Authentication required',
          error: 'AUTH_REQUIRED'
        };
        res.status(401).json(response);
        return;
      }

      if (req.user.role !== role) {
        const response: ApiResponse = {
          success: false,
          message: 'Insufficient permissions',
          error: 'INSUFFICIENT_PERMISSIONS'
        };
        res.status(403).json(response);
        return;
      }

      next();
    };
  }

  // Check if user is verified (for experts)
  static requireVerification(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required',
        error: 'AUTH_REQUIRED'
      };
      res.status(401).json(response);
      return;
    }

    if (req.user.role === 'expert') {
      // In a real app, you'd check if the expert is verified
      // For now, we'll allow all experts
      next();
    } else {
      next();
    }
  }

  // Optional authentication (doesn't fail if no token)
  static optionalAuth(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = AuthService.verifyToken(token);
      req.user = payload;
    } catch (error) {
      // Ignore error for optional auth
    }
    
    next();
  }
}

// Rate limiting middleware
export class RateLimitMiddleware {
  private static requests: Map<string, { count: number; resetTime: number }> = new Map();

  static create(windowMs: number = 900000, maxRequests: number = 100) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientId = req.ip || 'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean up old entries
      for (const [key, value] of this.requests.entries()) {
        if (value.resetTime < windowStart) {
          this.requests.delete(key);
        }
      }

      const clientData = this.requests.get(clientId);
      
      if (!clientData) {
        this.requests.set(clientId, { count: 1, resetTime: now });
        next();
        return;
      }

      if (clientData.resetTime < windowStart) {
        clientData.count = 1;
        clientData.resetTime = now;
        next();
        return;
      }

      if (clientData.count >= maxRequests) {
        const response: ApiResponse = {
          success: false,
          message: 'Too many requests',
          error: 'RATE_LIMIT_EXCEEDED'
        };
        res.status(429).json(response);
        return;
      }

      clientData.count++;
      next();
    };
  }
}

// Validation middleware
export class ValidationMiddleware {
  static validateRequest(schema: any) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.body);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        };
        res.status(400).json(response);
        return;
      }
      
      next();
    };
  }
}
