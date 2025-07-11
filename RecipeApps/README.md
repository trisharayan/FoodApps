#  Smart Recipe Assistant

An AI-powered recipe generation and meal planning application built with React, Node.js, and OpenAI. This comprehensive cooking assistant helps users create custom recipes, plan meals, analyze nutrition, and discover cooking tips using artificial intelligence.

##  Features

###  AI-Powered Recipe Generation
- **Custom Recipe Creation**: Generate unique recipes based on your preferences and available ingredients
- **Dietary Restrictions**: Support for vegetarian, vegan, gluten-free, keto, and other dietary needs
- **Cuisine Preferences**: Generate recipes from Italian, Mexican, Asian, Mediterranean, and more
- **Skill Level Adaptation**: Recipes tailored to beginner, intermediate, or advanced cooks
- **Nutritional Optimization**: AI ensures recipes meet your calorie and nutritional goals

###  Nutritional Analysis
- **Detailed Nutrition Info**: Calories, protein, carbs, fat, fiber, sugar, and sodium
- **Ingredient Analysis**: AI-powered nutritional breakdown of ingredients
- **Daily Tracking**: Monitor your daily nutritional intake
- **Health Goals**: Support for various dietary and health objectives

###  Smart Meal Planning
- **Weekly Meal Plans**: AI-generated 7-day meal plans
- **Nutritional Balance**: Ensures balanced meals throughout the week
- **Dietary Compliance**: Respects your dietary restrictions and preferences
- **Shopping Lists**: Automatic ingredient lists for meal plans

### Cooking Assistant
- **Cooking Tips**: Expert advice and techniques for each recipe
- **Recipe Variations**: Alternative versions and modifications
- **Ingredient Substitutions**: Smart suggestions for ingredient replacements
- **Cooking Techniques**: Step-by-step guidance and best practices

### User Management
- **User Registration & Authentication**: Secure JWT-based authentication
- **Personal Profiles**: Save preferences and dietary restrictions
- **Favorite Recipes**: Bookmark and organize your favorite recipes
- **User Preferences**: Personalized experience based on your cooking style

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data persistence
- **OpenAI GPT-4** for AI recipe generation
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** and **Helmet** for security

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Axios** for API communication

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-recipe-assistant
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

   Add your OpenAI API key and other configuration:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Set up the database**
   ```bash
   npm run setup-db
   ```

5. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
smart-recipe-assistant/
├── server/                 # Backend application
│   ├── index.js           # Main server file
│   ├── database.js        # Database connection and setup
│   ├── setup-database.js  # Database initialization with sample data
│   ├── services/
│   │   └── openai.js     # OpenAI API integration
│   └── routes/
│       ├── recipes.js     # Recipe CRUD operations
│       ├── ai.js          # AI-powered features
│       ├── mealPlans.js   # Meal planning functionality
│       ├── nutrition.js   # Nutritional analysis
│       └── auth.js        # Authentication routes
├── client/                # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── index.tsx     # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── data/                  # SQLite database files
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update user preferences

### Recipes
- `GET /api/recipes` - Get all recipes with filtering
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### AI Features
- `POST /api/ai/generate-recipe` - Generate recipe with AI
- `POST /api/ai/analyze-nutrition` - Analyze ingredient nutrition
- `POST /api/ai/generate-meal-plan` - Generate meal plan
- `POST /api/ai/cooking-tips` - Get cooking tips
- `POST /api/ai/substitutions` - Suggest ingredient substitutions

### Meal Plans
- `GET /api/meal-plans` - Get all meal plans
- `GET /api/meal-plans/:id` - Get meal plan by ID
- `POST /api/meal-plans` - Create meal plan
- `PUT /api/meal-plans/:id` - Update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan

### Nutrition
- `GET /api/nutrition/recipe/:id` - Get recipe nutrition
- `POST /api/nutrition/analyze` - Analyze ingredients
- `GET /api/nutrition/stats/overview` - Get nutrition statistics
- `POST /api/nutrition/daily-totals` - Calculate daily nutrition

## Usage Guide

### Getting Started
1. **Register an account** or sign in with existing credentials
2. **Navigate to AI Kitchen** to start generating recipes
3. **Enter your recipe idea** and set preferences
4. **Generate custom recipes** with AI assistance
5. **Save favorite recipes** to your profile

### Recipe Generation
1. Go to **AI Kitchen** → **Generate Recipe**
2. Describe your recipe idea (e.g., "A healthy vegetarian pasta with seasonal vegetables")
3. Set your preferences:
   - Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
   - Cuisine type (Italian, Mexican, Asian, etc.)
   - Skill level (beginner, intermediate, advanced)
   - Target calories per serving
4. Click **Generate Recipe** and wait for AI to create your custom recipe
5. View detailed instructions, ingredients, and nutritional information

### Meal Planning
1. Go to **AI Kitchen** → **Meal Planning**
2. Set your dietary preferences and calorie goals
3. Choose the number of days for your meal plan
4. Generate a personalized weekly meal plan
5. View nutritional breakdown and shopping lists

### Nutrition Tracking
1. Go to **Nutrition** section
2. View detailed nutritional information for recipes
3. Track your daily nutritional intake
4. Analyze ingredient nutrition
5. Get recommendations based on your health goals

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Cross-origin resource sharing security
- **Helmet Security**: HTTP headers security
- **Rate Limiting**: API request rate limiting
- **Input Validation**: Server-side validation for all inputs

## Sample Data

The application comes with sample recipe data including:
- Classic Margherita Pizza
- Chicken Tikka Masala
- Avocado Toast with Poached Eggs
- Chocolate Chip Cookies
- Quinoa Buddha Bowl

Each recipe includes:
- Detailed ingredients and instructions
- Nutritional information
- Cooking times and difficulty levels
- Cuisine classification and tags

## Deployment

### Production Build
```bash
# Build the frontend
cd client
npm run build

# Set NODE_ENV to production
export NODE_ENV=production

# Start the production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_production_openai_key
JWT_SECRET=your_secure_jwt_secret
DB_PATH=./data/recipes.db
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **OpenAI** for providing the GPT-4 API for recipe generation
- **React Team** for the amazing frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons

## Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

**Happy Cooking! 🍳✨** 
