'use client';

import { FormField } from '../types';

interface FormFieldComponentProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

const inputClasses = `
  w-full px-4 py-3 bg-white border border-slate-300 rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary 
  text-slate-900 placeholder-slate-400 transition-all duration-200
`;

const labelClasses = "block text-sm font-medium text-slate-700 mb-2";

export default function FormFieldComponent({ field, value, onChange, error }: FormFieldComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { type, checked, value: inputValue } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      onChange(checked);
    } else if (type === 'radio') {
      onChange(inputValue);
    } else {
      onChange(inputValue);
    }
  };

  const handleCheckboxGroupChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter(v => v !== optionValue));
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            id={field.fieldId}
            name={field.fieldId}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={inputClasses}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.fieldId}
            name={field.fieldId}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={inputClasses}
            data-testid={field.dataTestId}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            rows={4}
          />
        );
      
      case 'dropdown':
        return (
          <select
            id={field.fieldId}
            name={field.fieldId}
            value={value || ''}
            onChange={handleChange}
            className={inputClasses}
            data-testid={field.dataTestId}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                data-testid={option.dataTestId}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  data-testid={option.dataTestId}
                  className="mr-2"
                />
                <label htmlFor={`${field.fieldId}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'checkbox':
        if (field.options) {
          // Multiple checkboxes (checkbox group)
          return (
            <div className="space-y-2">
              {field.options.map(option => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                
                return (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${field.fieldId}-${option.value}`}
                      name={`${field.fieldId}-${option.value}`}
                      checked={isChecked}
                      onChange={(e) => handleCheckboxGroupChange(option.value, e.target.checked)}
                      data-testid={option.dataTestId}
                      className="mr-2"
                    />
                    <label htmlFor={`${field.fieldId}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.fieldId}
                name={field.fieldId}
                checked={!!value}
                onChange={handleChange}
                data-testid={field.dataTestId}
                className="mr-2"
              />
              <label htmlFor={field.fieldId}>
                {field.label}
              </label>
            </div>
          );
        }
      
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && (
        <label htmlFor={field.fieldId} className={labelClasses}>
          {field.label}
          {field.required && <span className="text-pink-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {error && (
        <p className="mt-2 text-sm text-pink-500">{error}</p>
      )}
    </div>
  );
}