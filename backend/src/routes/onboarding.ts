import { Router } from 'express';
import { OnboardingController } from '../controllers/OnboardingController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import Joi from 'joi';

const router = Router();

// Validation schema for onboarding data
const onboardingDataSchema = Joi.object({
  role: Joi.string().valid('customer', 'expert').required(),
  currentStep: Joi.string().valid('welcome', 'role-selection', 'profile-setup', 'verification', 'service-selection', 'location', 'completion').required(),
  completedSteps: Joi.array().items(Joi.string()).required(),
  customerData: Joi.object({
    personalInfo: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      dateOfBirth: Joi.string().optional()
    }).optional(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
      coordinates: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      }).optional()
    }).optional(),
    preferences: Joi.object({
      preferredServices: Joi.array().items(Joi.string()).required(),
      notificationSettings: Joi.object({
        email: Joi.boolean().required(),
        sms: Joi.boolean().required(),
        push: Joi.boolean().required()
      }).required()
    }).optional()
  }).optional(),
  expertData: Joi.object({
    personalInfo: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().email().required(),
      dateOfBirth: Joi.string().required(),
      gender: Joi.string().valid('male', 'female', 'other').required()
    }).optional(),
    professionalInfo: Joi.object({
      experience: Joi.number().min(0).required(),
      skills: Joi.array().items(Joi.string()).required(),
      certifications: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        issuingOrganization: Joi.string().required(),
        issueDate: Joi.string().required(),
        expiryDate: Joi.string().optional()
      })).required(),
      languages: Joi.array().items(Joi.string()).required()
    }).optional(),
    serviceInfo: Joi.object({
      selectedCategories: Joi.array().items(Joi.string()).required(),
      serviceAreas: Joi.array().items(Joi.object({
        city: Joi.string().required(),
        state: Joi.string().required(),
        radius: Joi.number().min(1).required()
      })).required(),
      availability: Joi.object({
        monday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required(),
        tuesday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required(),
        wednesday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required(),
        thursday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required(),
        friday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required(),
        saturday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required(),
        sunday: Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
          available: Joi.boolean().required()
        }).required()
      }).required()
    }).optional(),
    verification: Joi.object({
      idDocument: Joi.object({
        type: Joi.string().valid('aadhar', 'pan', 'passport', 'driving_license').required(),
        number: Joi.string().required(),
        frontImage: Joi.string().optional(),
        backImage: Joi.string().optional()
      }).required(),
      addressProof: Joi.object({
        type: Joi.string().valid('utility_bill', 'bank_statement', 'rental_agreement').required(),
        documentImage: Joi.string().optional()
      }).required(),
      bankDetails: Joi.object({
        accountNumber: Joi.string().required(),
        ifscCode: Joi.string().required(),
        accountHolderName: Joi.string().required()
      }).required()
    }).optional()
  }).optional()
});

// All onboarding routes require authentication
router.use(AuthMiddleware.authenticate);

// Get onboarding data
router.get('/', OnboardingController.getOnboardingData);

// Update onboarding data
router.put('/', 
  (req, res, next) => {
    const { error } = onboardingDataSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
      return;
    }
    next();
  },
  OnboardingController.updateOnboardingData
);

// Complete onboarding
router.post('/complete', OnboardingController.completeOnboarding);

// Reset onboarding (for testing)
router.post('/reset', OnboardingController.resetOnboarding);

export default router;
