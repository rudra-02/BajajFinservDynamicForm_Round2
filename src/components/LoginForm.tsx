'use client';

import { useState } from 'react';
import { User } from '../types';

interface LoginFormProps {
  onSubmit: (userData: User) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState<User>({
    rollNumber: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-effect w-full max-w-md p-8 rounded-2xl neon-border">
      <h2 className="text-2xl font-semibold mb-6 text-blue-900 bg-clip-text ">
        Student Access Portal
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="rollNumber" className="block text-sm  font-medium text-indigo-300">
            Roll Number
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-transparent border border-indigo-500/30 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent placeholder-indigo-300/50 transition-all duration-200"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-indigo-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-transparent border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-blue-800 placeholder-indigo-300/50 transition-all duration-200"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-400 transform hover:scale-[1.02] transition-all text-blue-800 duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
        >
          Access Portal
        </button>
      </form>
    </div>
  );
}