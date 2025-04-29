'use client';

import { useState } from 'react';
import { User } from '../types';
import { registerUser, getFormStructure } from '../services/api';
import DynamicForm from '../components/DynamicForm';
import LoginForm from '../components/LoginForm';
import { FormResponse } from '../types';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (userData: User) => {
    setLoading(true);
    setError(null);
    
    try {
      // Register the user
      await registerUser(userData);
      
      // Fetch the form structure
      const formResponse = await getFormStructure(userData.rollNumber);
      
      // Update state
      setUser(userData);
      setFormData(formResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (formValues: import('../types').FormData) => {
    console.log('Form submitted with values:', formValues);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-8">Dynamic Form Application</h1>
      
      {loading && <div className="text-center mb-4">Loading...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!user ? (
        <LoginForm onSubmit={handleLogin} />
      ) : formData ? (
        <DynamicForm 
          formData={formData.form} 
          onSubmit={handleFormSubmit} 
        />
      ) : null}
    </div>
  );
}
