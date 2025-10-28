import React, { useState } from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const VerificationStep: React.FC<StepComponentProps> = ({ context, onDataChange, onValidationChange }) => {
  const [formData, setFormData] = useState({
    idDocument: {
      type: '',
      number: '',
      frontImage: null as File | null,
      backImage: null as File | null
    },
    addressProof: {
      type: '',
      documentImage: null as File | null
    },
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (section: string, field: string, value: any) => {
    const newData = {
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value
      }
    };
    setFormData(newData);
    onDataChange(newData);
    
    // Clear error when user starts typing
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors({ ...errors, [errorKey]: '' });
    }
    
    validateForm(newData);
  };

  const handleFileUpload = (section: string, field: string, file: File) => {
    handleInputChange(section, field, file);
  };

  const validateForm = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};
    
    // ID Document validation
    if (!data.idDocument.type) {
      newErrors['idDocument.type'] = 'Please select document type';
    }
    if (!data.idDocument.number.trim()) {
      newErrors['idDocument.number'] = 'Document number is required';
    }
    if (!data.idDocument.frontImage) {
      newErrors['idDocument.frontImage'] = 'Front image is required';
    }
    
    // Bank Details validation
    if (!data.bankDetails.accountNumber.trim()) {
      newErrors['bankDetails.accountNumber'] = 'Account number is required';
    }
    if (!data.bankDetails.ifscCode.trim()) {
      newErrors['bankDetails.ifscCode'] = 'IFSC code is required';
    }
    if (!data.bankDetails.accountHolderName.trim()) {
      newErrors['bankDetails.accountHolderName'] = 'Account holder name is required';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
    
    return isValid;
  };

  const handleContinue = () => {
    if (validateForm(formData)) {
      context.updateSessionData({ verification: formData });
      context.onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Identity Verification
        </h1>
        <p className="text-lg text-gray-600">
          We need to verify your identity to ensure safety and security
        </p>
      </div>

      <div className="space-y-8">
        {/* ID Document Section */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ID Document
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                value={formData.idDocument.type}
                onChange={(e) => handleInputChange('idDocument', 'type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['idDocument.type'] ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select document type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
              </select>
              {errors['idDocument.type'] && (
                <p className="text-red-500 text-sm mt-1">{errors['idDocument.type']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Number *
              </label>
              <input
                type="text"
                value={formData.idDocument.number}
                onChange={(e) => handleInputChange('idDocument', 'number', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['idDocument.number'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter document number"
              />
              {errors['idDocument.number'] && (
                <p className="text-red-500 text-sm mt-1">{errors['idDocument.number']}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document Images *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Front Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('idDocument', 'frontImage', file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors['idDocument.frontImage'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['idDocument.frontImage']}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Back Image (if applicable)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('idDocument', 'backImage', file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Bank Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['bankDetails.accountNumber'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter account number"
              />
              {errors['bankDetails.accountNumber'] && (
                <p className="text-red-500 text-sm mt-1">{errors['bankDetails.accountNumber']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['bankDetails.ifscCode'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter IFSC code"
              />
              {errors['bankDetails.ifscCode'] && (
                <p className="text-red-500 text-sm mt-1">{errors['bankDetails.ifscCode']}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name *
              </label>
              <input
                type="text"
                value={formData.bankDetails.accountHolderName}
                onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors['bankDetails.accountHolderName'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter account holder name"
              />
              {errors['bankDetails.accountHolderName'] && (
                <p className="text-red-500 text-sm mt-1">{errors['bankDetails.accountHolderName']}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Proof Section */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Address Proof (Optional)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={formData.addressProof.type}
                onChange={(e) => handleInputChange('addressProof', 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select document type</option>
                <option value="utility_bill">Utility Bill</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="rental_agreement">Rental Agreement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('addressProof', 'documentImage', file);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleContinue}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
