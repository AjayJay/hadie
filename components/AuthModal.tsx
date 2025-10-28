import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'customer' | 'expert'>('customer');
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setError(null);
      setPasswordErrors([]);
    }
  }, [isOpen, initialMode]);

  // Client-side validation
  const validatePassword = (password: string): string[] => {
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
    return errors;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordErrors([]);

    try {
      if (authMode === 'login') {
        if (!email || !password) {
          setError('Email and password are required');
          return;
        }
        
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Invalid email or password');
        } else {
          onClose(); // Close modal on successful login
        }
      } else {
        // Registration validation
        if (!name || !email || !password || !phone) {
          setError('All fields are required');
          return;
        }

        if (!validateEmail(email)) {
          setError('Please enter a valid email address');
          return;
        }

        const passwordValidationErrors = validatePassword(password);
        if (passwordValidationErrors.length > 0) {
          setPasswordErrors(passwordValidationErrors);
          setError('Password does not meet requirements');
          return;
        }
        
        const result = await register({ name, email, password, phone, role });
        if (!result.success) {
          setError(result.error || 'Registration failed. Please try again.');
        } else {
          onClose(); // Close modal on successful registration
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const renderRegisterFields = () => (
    <>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          placeholder="Enter your phone number"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          I am a:
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="customer"
              checked={role === 'customer'}
              onChange={(e) => setRole(e.target.value as 'customer' | 'expert')}
              className="mr-2"
            />
            <span className="text-sm text-slate-700">Customer</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="expert"
              checked={role === 'expert'}
              onChange={(e) => setRole(e.target.value as 'customer' | 'expert')}
              className="mr-2"
            />
            <span className="text-sm text-slate-700">Expert</span>
          </label>
        </div>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {authMode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-slate-600">
                {authMode === 'login' 
                  ? 'Sign in to your Handie account' 
                  : 'Join Handie and start getting help today'
                }
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setAuthMode('login')} 
                className={`flex-1 py-3 font-semibold text-center focus:outline-none transition-colors ${
                  authMode === 'login' 
                    ? 'text-sky-600 border-b-2 border-sky-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('register')} 
                className={`flex-1 py-3 font-semibold text-center focus:outline-none transition-colors ${
                  authMode === 'register' 
                    ? 'text-sky-600 border-b-2 border-sky-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit}>
              {authMode === 'register' && renderRegisterFields()}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              {passwordErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                  <ul className="text-sm space-y-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
              >
                {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
