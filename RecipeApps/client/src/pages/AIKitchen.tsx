import React, { useState } from 'react';
import { Brain, ChefHat, Calendar, Lightbulb, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
}

const AIKitchen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recipe');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [prompt, setPrompt] = useState('');
  const [preferences, setPreferences] = useState({
    dietary: '',
    cuisine: '',
    skillLevel: 'intermediate',
    calories: 2000
  });

  const generateRecipe = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a recipe prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/generate-recipe', {
        prompt,
        preferences
      });
      setRecipe(response.data);
      toast.success('Recipe generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'recipe', name: 'Generate Recipe', icon: ChefHat },
    { id: 'meal-plan', name: 'Meal Planning', icon: Calendar },
    { id: 'tips', name: 'Cooking Tips', icon: Lightbulb }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          AI Kitchen Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let AI help you create amazing recipes, plan meals, and discover cooking tips
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Generation Tab */}
      {activeTab === 'recipe' && (
        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Generate Custom Recipe
            </h2>
            
            <div className="space-y-6">
              {/* Recipe Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your recipe idea
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A healthy vegetarian pasta dish with seasonal vegetables and a creamy sauce"
                  className="input-field h-32 resize-none"
                />
              </div>

              {/* Preferences */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <select
                    value={preferences.dietary}
                    onChange={(e) => setPreferences({...preferences, dietary: e.target.value})}
                    className="input-field"
                  >
                    <option value="">None</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="dairy-free">Dairy-Free</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    value={preferences.cuisine}
                    onChange={(e) => setPreferences({...preferences, cuisine: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="indian">Indian</option>
                    <option value="american">American</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={preferences.skillLevel}
                    onChange={(e) => setPreferences({...preferences, skillLevel: e.target.value})}
                    className="input-field"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Calories (per serving)
                  </label>
                  <input
                    type="number"
                    value={preferences.calories}
                    onChange={(e) => setPreferences({...preferences, calories: parseInt(e.target.value)})}
                    className="input-field"
                    min="100"
                    max="1000"
                  />
                </div>
              </div>

              <button
                onClick={generateRecipe}
                disabled={loading}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Recipe...</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="w-5 h-5" />
                    <span>Generate Recipe</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Recipe */}
          {recipe && (
            <div className="card">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {recipe.title}
              </h3>
              <p className="text-gray-600 mb-6">{recipe.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Recipe Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recipe Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prep Time:</span>
                      <span className="font-medium">{recipe.prep_time} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cook Time:</span>
                      <span className="font-medium">{recipe.cook_time} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Servings:</span>
                      <span className="font-medium">{recipe.servings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-medium capitalize">{recipe.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuisine:</span>
                      <span className="font-medium capitalize">{recipe.cuisine}</span>
                    </div>
                  </div>
                </div>

                {/* Nutrition */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Nutrition (per serving)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories:</span>
                      <span className="font-medium">{recipe.nutrition.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium">{recipe.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carbs:</span>
                      <span className="font-medium">{recipe.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fat:</span>
                      <span className="font-medium">{recipe.nutrition.fat}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h4>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h4>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-4">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tags */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meal Planning Tab */}
      {activeTab === 'meal-plan' && (
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              AI Meal Planning
            </h2>
            <p className="text-gray-600 mb-6">
              Coming soon! Our AI will help you create personalized meal plans based on your preferences, 
              dietary restrictions, and nutritional goals.
            </p>
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Features coming soon:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Personalized weekly meal plans</li>
                <li>• Nutritional balance optimization</li>
                <li>• Shopping list generation</li>
                <li>• Dietary restriction compliance</li>
                <li>• Recipe variety suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cooking Tips Tab */}
      {activeTab === 'tips' && (
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              AI Cooking Tips & Variations
            </h2>
            <p className="text-gray-600 mb-6">
              Coming soon! Get expert cooking tips, recipe variations, and ingredient substitutions 
              powered by AI culinary expertise.
            </p>
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Features coming soon:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Expert cooking techniques</li>
                <li>• Recipe variations and modifications</li>
                <li>• Ingredient substitution suggestions</li>
                <li>• Cooking time optimization</li>
                <li>• Flavor pairing recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIKitchen; 