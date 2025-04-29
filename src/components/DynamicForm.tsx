'use client';

import { useState } from 'react';
import { FormSection, FormField, FormData } from '../types';
import FormFieldComponent from './FormFieldComponent';
import SuccessModal from './SuccessModal';

interface DynamicFormProps {
  formData: {
    formTitle: string;
    formId: string;
    version: string;
    sections: FormSection[];
  };
  onSubmit: (formValues: Record<string, any>) => void;
}

export default function DynamicForm({ formData, onSubmit }: DynamicFormProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [values, setValues] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const currentSection = formData.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === formData.sections.length - 1;

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return field.validation?.message || 'This field is required';
    }

    if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }

    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }

    return '';
  };

  const validateSection = (sectionIndex: number): boolean => {
    const section = formData.sections[sectionIndex];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach(field => {
      const error = validateField(field, values[field.fieldId]);
      if (error) {
        newErrors[field.fieldId] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateSection(currentSectionIndex)) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSectionIndex(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateSection(currentSectionIndex)) {
      try {
        await onSubmit(values);
        setShowSuccess(true);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  const progress = ((currentSectionIndex + 1) / formData.sections.length) * 100;

  return (
    <>
      <div className="w-full max-w-3xl">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Section {currentSectionIndex + 1} of {formData.sections.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-8 glass-effect rounded-xl">
          <h2 className="text-2xl font-semibold mb-2 text-slate-800">
            {formData.formTitle}
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Form ID: {formData.formId} | Version: {formData.version}
          </p>
          
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-lg border border-slate-200">
              <h3 className="text-xl font-medium mb-2 text-slate-700">
                {currentSection.title}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {currentSection.description}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentSection.fields.map(field => (
                  <div key={field.fieldId} className="mb-4">
                    <FormFieldComponent
                      field={field}
                      value={values[field.fieldId]}
                      onChange={(value) => handleFieldChange(field.fieldId, value)}
                      error={errors[field.fieldId]}
                    />
                  </div>
                ))}
                
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  {currentSectionIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg 
                               hover:bg-slate-50 transition-all duration-200 border-1"
                    >
                      Previous
                    </button>
                  )}
                  
                  {!isLastSection ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 bg-primary rounded-lg border border-slate-300 
                           hover:bg-primary-hover transform hover:scale-[1.2] 
                           transition-all duration-200 ml-auto"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-500 text-white rounded-lg 
                               hover:bg-emerald-600 transform hover:scale-[1.02] 
                               transition-all duration-200 ml-auto"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setValues({});
          setCurrentSectionIndex(0);
        }}
      />
    </>
  );
}