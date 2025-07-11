const { runQuery } = require('./database');

const sampleRecipes = [
  {
    title: "Classic Margherita Pizza",
    description: "A traditional Italian pizza with fresh mozzarella, basil, and tomato sauce",
    ingredients: [
      "2 cups all-purpose flour",
      "1 cup warm water",
      "2 1/4 tsp active dry yeast",
      "1 tsp salt",
      "1 tbsp olive oil",
      "1/2 cup tomato sauce",
      "8 oz fresh mozzarella",
      "Fresh basil leaves",
      "2 tbsp olive oil for drizzling"
    ],
    instructions: [
      "Mix flour, yeast, and salt in a large bowl",
      "Add warm water and olive oil, knead for 10 minutes",
      "Let dough rise for 1 hour in a warm place",
      "Roll out dough and add tomato sauce",
      "Top with mozzarella and bake at 450°F for 15 minutes",
      "Add fresh basil and drizzle with olive oil"
    ],
    prep_time: 30,
    cook_time: 15,
    servings: 4,
    difficulty: "medium",
    cuisine: "Italian",
    tags: ["pizza", "vegetarian", "dinner"],
    nutrition: {
      calories: 350,
      protein: 15,
      carbs: 45,
      fat: 12,
      fiber: 3,
      sugar: 2,
      sodium: 800
    }
  },
  {
    title: "Chicken Tikka Masala",
    description: "Creamy and flavorful Indian curry with tender chicken",
    ingredients: [
      "1 lb chicken breast, cubed",
      "1 cup yogurt",
      "2 tbsp tikka masala paste",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "1 inch ginger, grated",
      "1 can coconut milk",
      "2 tbsp tomato paste",
      "1 tsp garam masala",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Marinate chicken in yogurt and tikka paste for 30 minutes",
      "Sauté onion, garlic, and ginger until fragrant",
      "Add chicken and cook until browned",
      "Add coconut milk and tomato paste",
      "Simmer for 20 minutes until sauce thickens",
      "Garnish with fresh cilantro"
    ],
    prep_time: 45,
    cook_time: 25,
    servings: 4,
    difficulty: "medium",
    cuisine: "Indian",
    tags: ["curry", "chicken", "dinner"],
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 8,
      fat: 32,
      fiber: 2,
      sugar: 4,
      sodium: 650
    }
  },
  {
    title: "Avocado Toast with Poached Eggs",
    description: "A healthy and delicious breakfast with creamy avocado and perfectly poached eggs",
    ingredients: [
      "4 slices whole grain bread",
      "2 ripe avocados",
      "4 large eggs",
      "1 tbsp white vinegar",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "Fresh microgreens for garnish"
    ],
    instructions: [
      "Toast bread until golden brown",
      "Mash avocados and season with salt and pepper",
      "Bring water to simmer and add vinegar",
      "Crack eggs into simmering water and poach for 3 minutes",
      "Spread avocado on toast",
      "Top with poached eggs and garnish"
    ],
    prep_time: 10,
    cook_time: 5,
    servings: 2,
    difficulty: "easy",
    cuisine: "American",
    tags: ["breakfast", "vegetarian", "healthy"],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 25,
      fat: 28,
      fiber: 8,
      sugar: 2,
      sodium: 450
    }
  },
  {
    title: "Chocolate Chip Cookies",
    description: "Classic homemade chocolate chip cookies with crispy edges and chewy centers",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "1 tsp vanilla extract",
      "1 tsp baking soda",
      "1/2 tsp salt",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Cream butter and sugars until light and fluffy",
      "Beat in eggs and vanilla",
      "Mix in flour, baking soda, and salt",
      "Fold in chocolate chips",
      "Drop rounded tablespoons onto baking sheet",
      "Bake at 375°F for 10-12 minutes"
    ],
    prep_time: 15,
    cook_time: 12,
    servings: 24,
    difficulty: "easy",
    cuisine: "American",
    tags: ["dessert", "baking", "chocolate"],
    nutrition: {
      calories: 150,
      protein: 2,
      carbs: 18,
      fat: 8,
      fiber: 1,
      sugar: 12,
      sodium: 120
    }
  },
  {
    title: "Quinoa Buddha Bowl",
    description: "A nutritious and colorful bowl packed with protein and vegetables",
    ingredients: [
      "1 cup quinoa",
      "2 cups vegetable broth",
      "1 sweet potato, cubed",
      "1 cup chickpeas, drained",
      "2 cups kale, chopped",
      "1 avocado, sliced",
      "1/4 cup tahini",
      "2 tbsp lemon juice",
      "1 tbsp olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook quinoa in vegetable broth for 15 minutes",
      "Roast sweet potato and chickpeas at 400°F for 25 minutes",
      "Sauté kale with olive oil until wilted",
      "Mix tahini, lemon juice, and water for dressing",
      "Assemble bowl with quinoa, vegetables, and dressing"
    ],
    prep_time: 20,
    cook_time: 25,
    servings: 2,
    difficulty: "easy",
    cuisine: "Mediterranean",
    tags: ["vegetarian", "healthy", "bowl"],
    nutrition: {
      calories: 450,
      protein: 16,
      carbs: 55,
      fat: 22,
      fiber: 12,
      sugar: 8,
      sodium: 380
    }
  }
];

async function setupDatabase() {
  try {
    console.log('🗄️  Setting up database with sample data...');

    // Insert sample recipes
    for (const recipe of sampleRecipes) {
      const result = await runQuery(`
        INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, cuisine, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        recipe.title,
        recipe.description,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.instructions),
        recipe.prep_time,
        recipe.cook_time,
        recipe.servings,
        recipe.difficulty,
        recipe.cuisine,
        JSON.stringify(recipe.tags)
      ]);

      // Add nutritional information
      await runQuery(`
        INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat, fiber, sugar, sodium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        result.id,
        recipe.nutrition.calories,
        recipe.nutrition.protein,
        recipe.nutrition.carbs,
        recipe.nutrition.fat,
        recipe.nutrition.fiber,
        recipe.nutrition.sugar,
        recipe.nutrition.sodium
      ]);
    }

    console.log('✅ Database setup completed successfully!');
    console.log(`📊 Added ${sampleRecipes.length} sample recipes`);
    console.log('🚀 You can now start the application with: npm run dev');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 