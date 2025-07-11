import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChefHat, 
  Brain, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Users, 
  Heart 
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Recipe Generation',
      description: 'Create unique recipes with AI based on your preferences and available ingredients'
    },
    {
      icon: Calendar,
      title: 'Smart Meal Planning',
      description: 'Plan your weekly meals with nutritional balance and dietary restrictions'
    },
    {
      icon: BarChart3,
      title: 'Nutritional Analysis',
      description: 'Get detailed nutritional information for every recipe and meal plan'
    },
    {
      icon: Sparkles,
      title: 'Cooking Tips & Variations',
      description: 'Get expert cooking tips and recipe variations to enhance your culinary skills'
    }
  ];

  const stats = [
    { icon: ChefHat, value: '500+', label: 'Recipes' },
    { icon: Users, value: '10K+', label: 'Users' },
    { icon: Clock, value: '15min', label: 'Avg Prep Time' },
    { icon: Heart, value: '4.8★', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                {' '}Kitchen Assistant
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover, create, and plan delicious meals with the help of artificial intelligence. 
              From recipe generation to nutritional analysis, we've got everything you need to become a master chef.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ai-kitchen"
                className="btn-primary text-lg px-8 py-3"
              >
                Start Cooking with AI
              </Link>
              <Link
                to="/recipes"
                className="btn-secondary text-lg px-8 py-3"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Cook Like a Pro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines culinary expertise with cutting-edge technology 
              to revolutionize your cooking experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of home chefs who are already creating amazing meals with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/ai-kitchen"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Try AI Kitchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 