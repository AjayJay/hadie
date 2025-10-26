import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { ApiResponse, OnboardingData } from '../types';

export class OnboardingController {
  // Get onboarding data
  static async getOnboardingData(req: Request, res: Response): Promise<void> {
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
        message: 'Onboarding data retrieved successfully',
        data: user.onboardingData || {
          role: user.role,
          currentStep: 'welcome',
          completedSteps: []
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get onboarding data error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to retrieve onboarding data',
        error: 'ONBOARDING_DATA_RETRIEVAL_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Update onboarding data
  static async updateOnboardingData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const onboardingData: OnboardingData = req.body;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          error: 'NOT_AUTHENTICATED'
        };
        res.status(401).json(response);
        return;
      }

      // Validate onboarding data
      if (!onboardingData.role || !onboardingData.currentStep) {
        const response: ApiResponse = {
          success: false,
          message: 'Invalid onboarding data',
          error: 'INVALID_ONBOARDING_DATA'
        };
        res.status(400).json(response);
        return;
      }

      // Validate role matches user's role
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

      if (user.role !== onboardingData.role) {
        const response: ApiResponse = {
          success: false,
          message: 'Role mismatch',
          error: 'ROLE_MISMATCH'
        };
        res.status(400).json(response);
        return;
      }

      // Update onboarding data
      const updatedUser = await UserModel.updateOnboardingData(userId, onboardingData);

      const response: ApiResponse = {
        success: true,
        message: 'Onboarding data updated successfully',
        data: updatedUser.onboardingData
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update onboarding data error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update onboarding data',
        error: 'ONBOARDING_DATA_UPDATE_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Complete onboarding
  static async completeOnboarding(req: Request, res: Response): Promise<void> {
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

      if (!user.onboardingData) {
        const response: ApiResponse = {
          success: false,
          message: 'No onboarding data found',
          error: 'NO_ONBOARDING_DATA'
        };
        res.status(400).json(response);
        return;
      }

      // Mark onboarding as completed
      const completedOnboardingData: OnboardingData = {
        ...user.onboardingData,
        currentStep: 'completion',
        completedSteps: [...user.onboardingData.completedSteps, user.onboardingData.currentStep]
      };

      const updatedUser = await UserModel.updateOnboardingData(userId, completedOnboardingData);

      const response: ApiResponse = {
        success: true,
        message: 'Onboarding completed successfully',
        data: updatedUser
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Complete onboarding error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to complete onboarding',
        error: 'ONBOARDING_COMPLETION_FAILED'
      };
      res.status(500).json(response);
    }
  }

  // Reset onboarding (for testing purposes)
  static async resetOnboarding(req: Request, res: Response): Promise<void> {
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

      // Reset onboarding data
      const resetOnboardingData: OnboardingData = {
        role: user.role,
        currentStep: 'welcome',
        completedSteps: []
      };

      const updatedUser = await UserModel.updateOnboardingData(userId, resetOnboardingData);

      const response: ApiResponse = {
        success: true,
        message: 'Onboarding reset successfully',
        data: updatedUser.onboardingData
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Reset onboarding error:', error);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to reset onboarding',
        error: 'ONBOARDING_RESET_FAILED'
      };
      res.status(500).json(response);
    }
  }
}
