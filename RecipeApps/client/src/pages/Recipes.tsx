import React from 'react';
import { ChefHat } from 'lucide-react';

const Recipes: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Recipe Collection
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Browse our collection of delicious recipes or create your own with AI
        </p>
      </div>

      <div className="card text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Recipe Browser Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          We're working on a comprehensive recipe browser with search, filtering, and favorites functionality.
        </p>
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Features coming soon:</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Search and filter recipes</li>
            <li>• Save favorite recipes</li>
            <li>• Rate and review recipes</li>
            <li>• Nutritional information</li>
            <li>• Recipe sharing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recipes; 