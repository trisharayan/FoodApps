const express = require('express');
const router = express.Router();
const { runQuery, getRow, getAll } = require('../database');
const OpenAIService = require('../services/openai');

// Get nutrition info for a recipe
router.get('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const nutrition = await getRow(`
      SELECT * FROM nutrition WHERE recipe_id = ?
    `, [id]);
    
    if (!nutrition) {
      return res.status(404).json({ error: 'Nutrition information not found' });
    }
    
    res.json(nutrition);
  } catch (error) {
    console.error('Error fetching nutrition:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition information' });
  }
});

// Update nutrition info for a recipe
router.put('/recipe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { calories, protein, carbs, fat, fiber, sugar, sodium } = req.body;
    
    const result = await runQuery(`
      INSERT OR REPLACE INTO nutrition (recipe_id, calories, protein, carbs, fat, fiber, sugar, sodium)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, calories, protein, carbs, fat, fiber, sugar, sodium]);
    
    res.json({ message: 'Nutrition information updated successfully' });
  } catch (error) {
    console.error('Error updating nutrition:', error);
    res.status(500).json({ error: 'Failed to update nutrition information' });
  }
});

// Analyze nutrition from ingredients
router.post('/analyze', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }
    
    const nutrition = await OpenAIService.analyzeNutrition(ingredients);
    res.json(nutrition);
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
});

// Get nutrition statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await getAll(`
      SELECT 
        AVG(calories) as avg_calories,
        AVG(protein) as avg_protein,
        AVG(carbs) as avg_carbs,
        AVG(fat) as avg_fat,
        AVG(fiber) as avg_fiber,
        AVG(sugar) as avg_sugar,
        AVG(sodium) as avg_sodium,
        COUNT(*) as total_recipes_with_nutrition
      FROM nutrition
    `);
    
    const calorieRanges = await getAll(`
      SELECT 
        CASE 
          WHEN calories < 200 THEN 'Low (< 200)'
          WHEN calories < 400 THEN 'Medium (200-400)'
          WHEN calories < 600 THEN 'High (400-600)'
          ELSE 'Very High (> 600)'
        END as calorie_range,
        COUNT(*) as count
      FROM nutrition
      GROUP BY calorie_range
      ORDER BY count DESC
    `);
    
    const highProteinRecipes = await getAll(`
      SELECT r.title, n.protein, n.calories
      FROM nutrition n
      JOIN recipes r ON n.recipe_id = r.id
      ORDER BY n.protein DESC
      LIMIT 10
    `);
    
    const lowCalorieRecipes = await getAll(`
      SELECT r.title, n.calories, n.protein, n.carbs, n.fat
      FROM nutrition n
      JOIN recipes r ON n.recipe_id = r.id
      WHERE n.calories < 300
      ORDER BY n.calories ASC
      LIMIT 10
    `);
    
    res.json({
      overview: stats[0],
      calorieRanges,
      highProteinRecipes,
      lowCalorieRecipes
    });
  } catch (error) {
    console.error('Error fetching nutrition stats:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition statistics' });
  }
});

// Get recipes by nutrition criteria
router.get('/recipes/filter', async (req, res) => {
  try {
    const { 
      maxCalories, 
      minProtein, 
      maxCarbs, 
      maxFat, 
      maxSugar, 
      maxSodium,
      sortBy = 'calories',
      sortOrder = 'ASC',
      limit = 20
    } = req.query;
    
    let sql = `
      SELECT r.*, n.calories, n.protein, n.carbs, n.fat, n.fiber, n.sugar, n.sodium
      FROM recipes r
      JOIN nutrition n ON r.id = n.recipe_id
      WHERE 1=1
    `;
    const params = [];
    
    if (maxCalories) {
      sql += ` AND n.calories <= ?`;
      params.push(maxCalories);
    }
    
    if (minProtein) {
      sql += ` AND n.protein >= ?`;
      params.push(minProtein);
    }
    
    if (maxCarbs) {
      sql += ` AND n.carbs <= ?`;
      params.push(maxCarbs);
    }
    
    if (maxFat) {
      sql += ` AND n.fat <= ?`;
      params.push(maxFat);
    }
    
    if (maxSugar) {
      sql += ` AND n.sugar <= ?`;
      params.push(maxSugar);
    }
    
    if (maxSodium) {
      sql += ` AND n.sodium <= ?`;
      params.push(maxSodium);
    }
    
    sql += ` ORDER BY n.${sortBy} ${sortOrder}`;
    sql += ` LIMIT ?`;
    params.push(limit);
    
    const recipes = await getAll(sql, params);
    res.json(recipes);
  } catch (error) {
    console.error('Error filtering recipes by nutrition:', error);
    res.status(500).json({ error: 'Failed to filter recipes' });
  }
});

// Calculate daily nutrition totals
router.post('/daily-totals', async (req, res) => {
  try {
    const { recipes } = req.body;
    
    if (!recipes || !Array.isArray(recipes)) {
      return res.status(400).json({ error: 'Recipes array is required' });
    }
    
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };
    
    for (const recipe of recipes) {
      const nutrition = await getRow(`
        SELECT * FROM nutrition WHERE recipe_id = ?
      `, [recipe.id]);
      
      if (nutrition) {
        totals.calories += nutrition.calories || 0;
        totals.protein += nutrition.protein || 0;
        totals.carbs += nutrition.carbs || 0;
        totals.fat += nutrition.fat || 0;
        totals.fiber += nutrition.fiber || 0;
        totals.sugar += nutrition.sugar || 0;
        totals.sodium += nutrition.sodium || 0;
      }
    }
    
    // Calculate percentages based on daily recommended values
    const dailyValues = {
      calories: 2000,
      protein: 50, // grams
      carbs: 275, // grams
      fat: 55, // grams
      fiber: 28, // grams
      sugar: 50, // grams
      sodium: 2300 // mg
    };
    
    const percentages = {};
    for (const [nutrient, total] of Object.entries(totals)) {
      percentages[nutrient] = Math.round((total / dailyValues[nutrient]) * 100);
    }
    
    res.json({
      totals,
      percentages,
      dailyValues
    });
  } catch (error) {
    console.error('Error calculating daily totals:', error);
    res.status(500).json({ error: 'Failed to calculate daily totals' });
  }
});

module.exports = router; 