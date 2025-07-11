const express = require('express');
const router = express.Router();
const { runQuery, getRow, getAll } = require('../database');
const OpenAIService = require('../services/openai');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const { cuisine, difficulty, tags, search } = req.query;
    let sql = `
      SELECT r.*, n.calories, n.protein, n.carbs, n.fat 
      FROM recipes r 
      LEFT JOIN nutrition n ON r.id = n.recipe_id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(r.title LIKE ? OR r.description LIKE ? OR r.ingredients LIKE ?)`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (cuisine) {
      conditions.push(`r.cuisine = ?`);
      params.push(cuisine);
    }

    if (difficulty) {
      conditions.push(`r.difficulty = ?`);
      params.push(difficulty);
    }

    if (tags) {
      conditions.push(`r.tags LIKE ?`);
      params.push(`%${tags}%`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY r.created_at DESC`;

    const recipes = await getAll(sql, params);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT r.*, n.calories, n.protein, n.carbs, n.fat, n.fiber, n.sugar, n.sodium
      FROM recipes r 
      LEFT JOIN nutrition n ON r.id = n.recipe_id
      WHERE r.id = ?
    `;
    
    const recipe = await getRow(sql, [id]);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Parse JSON fields
    recipe.ingredients = JSON.parse(recipe.ingredients);
    recipe.instructions = JSON.parse(recipe.instructions);
    recipe.tags = JSON.parse(recipe.tags);

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Create new recipe
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      servings,
      difficulty,
      cuisine,
      tags,
      image_url,
      nutrition
    } = req.body;

    // Validate required fields
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Title, ingredients, and instructions are required' });
    }

    const sql = `
      INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, cuisine, tags, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await runQuery(sql, [
      title,
      description,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      prep_time,
      cook_time,
      servings,
      difficulty,
      cuisine,
      JSON.stringify(tags),
      image_url
    ]);

    // Add nutritional information if provided
    if (nutrition && result.id) {
      const nutritionSql = `
        INSERT INTO nutrition (recipe_id, calories, protein, carbs, fat, fiber, sugar, sodium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await runQuery(nutritionSql, [
        result.id,
        nutrition.calories,
        nutrition.protein,
        nutrition.carbs,
        nutrition.fat,
        nutrition.fiber,
        nutrition.sugar,
        nutrition.sodium
      ]);
    }

    res.status(201).json({ 
      message: 'Recipe created successfully',
      id: result.id 
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      servings,
      difficulty,
      cuisine,
      tags,
      image_url,
      nutrition
    } = req.body;

    const sql = `
      UPDATE recipes 
      SET title = ?, description = ?, ingredients = ?, instructions = ?, 
          prep_time = ?, cook_time = ?, servings = ?, difficulty = ?, 
          cuisine = ?, tags = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await runQuery(sql, [
      title,
      description,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      prep_time,
      cook_time,
      servings,
      difficulty,
      cuisine,
      JSON.stringify(tags),
      image_url,
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Update nutritional information if provided
    if (nutrition) {
      const nutritionSql = `
        INSERT OR REPLACE INTO nutrition (recipe_id, calories, protein, carbs, fat, fiber, sugar, sodium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await runQuery(nutritionSql, [
        id,
        nutrition.calories,
        nutrition.protein,
        nutrition.carbs,
        nutrition.fat,
        nutrition.fiber,
        nutrition.sugar,
        nutrition.sodium
      ]);
    }

    res.json({ message: 'Recipe updated successfully' });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete nutrition data first
    await runQuery('DELETE FROM nutrition WHERE recipe_id = ?', [id]);
    
    // Delete recipe
    const result = await runQuery('DELETE FROM recipes WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// Get recipe statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await getAll(`
      SELECT 
        COUNT(*) as total_recipes,
        COUNT(DISTINCT cuisine) as unique_cuisines,
        AVG(prep_time + cook_time) as avg_cooking_time,
        AVG(servings) as avg_servings
      FROM recipes
    `);

    const difficultyStats = await getAll(`
      SELECT difficulty, COUNT(*) as count
      FROM recipes
      GROUP BY difficulty
    `);

    const cuisineStats = await getAll(`
      SELECT cuisine, COUNT(*) as count
      FROM recipes
      GROUP BY cuisine
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      overview: stats[0],
      difficultyBreakdown: difficultyStats,
      topCuisines: cuisineStats
    });
  } catch (error) {
    console.error('Error fetching recipe stats:', error);
    res.status(500).json({ error: 'Failed to fetch recipe statistics' });
  }
});

module.exports = router; 