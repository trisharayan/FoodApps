import React from 'react';
import { Calendar } from 'lucide-react';

const MealPlans: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Meal Planning
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plan your weekly meals with AI assistance
        </p>
      </div>

      <div className="card text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Meal Planning Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          AI-powered meal planning with nutritional balance and dietary preferences.
        </p>
      </div>
    </div>
  );
};

export default MealPlans; 