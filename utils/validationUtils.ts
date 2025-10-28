import React from 'react';

// Enhanced validation utilities
export class ValidationUtils {
  // Email validation with better regex
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  // Phone validation with international support
  static validatePhone(phone: string, countryCode: string = 'IN'): boolean {
    const phoneRegex = {
      'IN': /^[6-9]\d{9}$/, // Indian mobile numbers
      'US': /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, // US format
      'UK': /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/, // UK format
    };
    
    const cleanPhone = phone.replace(/\D/g, '');
    return phoneRegex[countryCode as keyof typeof phoneRegex]?.test(cleanPhone) || false;
  }

  // File validation
  static validateFile(file: File, options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], allowedExtensions = ['.jpg', '.jpeg', '.png'] } = options;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { isValid: false, error: `File size must be less than ${maxSize}MB` };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { isValid: false, error: `File extension must be one of: ${allowedExtensions.join(', ')}` };
    }

    return { isValid: true };
  }

  // Password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Date validation
  static validateDate(dateString: string, minAge?: number, maxAge?: number): { isValid: boolean; error?: string } {
    const date = new Date(dateString);
    const today = new Date();
    
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    if (date > today) {
      return { isValid: false, error: 'Date cannot be in the future' };
    }
    
    if (minAge) {
      const age = today.getFullYear() - date.getFullYear();
      if (age < minAge) {
        return { isValid: false, error: `Must be at least ${minAge} years old` };
      }
    }
    
    if (maxAge) {
      const age = today.getFullYear() - date.getFullYear();
      if (age > maxAge) {
        return { isValid: false, error: `Must be less than ${maxAge} years old` };
      }
    }
    
    return { isValid: true };
  }

  // Required field validation
  static validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return { isValid: false, error: `${fieldName} cannot be empty` };
    }
    
    return { isValid: true };
  }

  // Array validation
  static validateArray(value: any[], fieldName: string, minLength?: number, maxLength?: number): { isValid: boolean; error?: string } {
    if (!Array.isArray(value)) {
      return { isValid: false, error: `${fieldName} must be an array` };
    }
    
    if (minLength && value.length < minLength) {
      return { isValid: false, error: `${fieldName} must have at least ${minLength} items` };
    }
    
    if (maxLength && value.length > maxLength) {
      return { isValid: false, error: `${fieldName} cannot have more than ${maxLength} items` };
    }
    
    return { isValid: true };
  }
}

// Enhanced form validation hook
export const useFormValidation = (initialData: Record<string, any> = {}) => {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validateField = React.useCallback((fieldName: string, value: any, rules: ValidationRule[]) => {
    for (const rule of rules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        return result.error;
      }
    }
    return null;
  }, []);

  const validateAll = React.useCallback((validationRules: Record<string, ValidationRule[]>) => {
    const newErrors: Record<string, string> = {};
    let allValid = true;

    for (const [fieldName, rules] of Object.entries(validationRules)) {
      const error = validateField(fieldName, data[fieldName], rules);
      if (error) {
        newErrors[fieldName] = error;
        allValid = false;
      }
    }

    setErrors(newErrors);
    setIsValid(allValid);
    return allValid;
  }, [data, validateField]);

  const updateField = React.useCallback((fieldName: string, value: any) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  }, [errors]);

  return {
    data,
    errors,
    isValid,
    updateField,
    validateAll,
    setData
  };
};

// Validation rule interface
export interface ValidationRule {
  validate: (value: any) => { isValid: boolean; error?: string };
}

// Predefined validation rules
export const ValidationRules = {
  required: (fieldName: string): ValidationRule => ({
    validate: (value) => ValidationUtils.validateRequired(value, fieldName)
  }),
  
  email: (): ValidationRule => ({
    validate: (value) => ValidationUtils.validateEmail(value) 
      ? { isValid: true } 
      : { isValid: false, error: 'Please enter a valid email address' }
  }),
  
  phone: (countryCode: string = 'IN'): ValidationRule => ({
    validate: (value) => ValidationUtils.validatePhone(value, countryCode)
      ? { isValid: true }
      : { isValid: false, error: 'Please enter a valid phone number' }
  }),
  
  minLength: (min: number): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length >= min
      ? { isValid: true }
      : { isValid: false, error: `Must be at least ${min} characters long` }
  }),
  
  maxLength: (max: number): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length <= max
      ? { isValid: true }
      : { isValid: false, error: `Must be no more than ${max} characters long` }
  }),
  
  date: (minAge?: number, maxAge?: number): ValidationRule => ({
    validate: (value) => ValidationUtils.validateDate(value, minAge, maxAge)
  }),
  
  array: (fieldName: string, minLength?: number, maxLength?: number): ValidationRule => ({
    validate: (value) => ValidationUtils.validateArray(value, fieldName, minLength, maxLength)
  })
};

// Debounced validation hook
export const useDebouncedValidation = (
  value: any,
  validationFn: (value: any) => { isValid: boolean; error?: string },
  delay: number = 300
) => {
  const [isValid, setIsValid] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const result = validationFn(value);
      setIsValid(result.isValid);
      setError(result.error);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, validationFn, delay]);

  return { isValid, error };
};
