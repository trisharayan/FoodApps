const express = require('express');
const router = express.Router();
const { runQuery, getRow, getAll } = require('../database');

// Get all meal plans
router.get('/', async (req, res) => {
  try {
    const mealPlans = await getAll(`
      SELECT * FROM meal_plans 
      ORDER BY created_at DESC
    `);
    res.json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
});

// Get meal plan by ID with details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mealPlan = await getRow('SELECT * FROM meal_plans WHERE id = ?', [id]);
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    const items = await getAll(`
      SELECT mpi.*, r.title, r.description, r.image_url, n.calories
      FROM meal_plan_items mpi
      JOIN recipes r ON mpi.recipe_id = r.id
      LEFT JOIN nutrition n ON r.id = n.recipe_id
      WHERE mpi.meal_plan_id = ?
      ORDER BY mpi.day, mpi.meal_type
    `, [id]);

    mealPlan.days = JSON.parse(mealPlan.days);
    mealPlan.items = items;

    res.json(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
});

// Create new meal plan
router.post('/', async (req, res) => {
  try {
    const { name, description, days, total_calories, items } = req.body;

    if (!name || !days || !items) {
      return res.status(400).json({ error: 'Name, days, and items are required' });
    }

    const result = await runQuery(`
      INSERT INTO meal_plans (name, description, days, total_calories)
      VALUES (?, ?, ?, ?)
    `, [name, description, JSON.stringify(days), total_calories]);

    // Add meal plan items
    for (const item of items) {
      await runQuery(`
        INSERT INTO meal_plan_items (meal_plan_id, recipe_id, day, meal_type)
        VALUES (?, ?, ?, ?)
      `, [result.id, item.recipe_id, item.day, item.meal_type]);
    }

    res.status(201).json({ 
      message: 'Meal plan created successfully',
      id: result.id 
    });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({ error: 'Failed to create meal plan' });
  }
});

// Update meal plan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, days, total_calories, items } = req.body;

    const result = await runQuery(`
      UPDATE meal_plans 
      SET name = ?, description = ?, days = ?, total_calories = ?
      WHERE id = ?
    `, [name, description, JSON.stringify(days), total_calories, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    // Update meal plan items
    if (items) {
      // Delete existing items
      await runQuery('DELETE FROM meal_plan_items WHERE meal_plan_id = ?', [id]);
      
      // Add new items
      for (const item of items) {
        await runQuery(`
          INSERT INTO meal_plan_items (meal_plan_id, recipe_id, day, meal_type)
          VALUES (?, ?, ?, ?)
        `, [id, item.recipe_id, item.day, item.meal_type]);
      }
    }

    res.json({ message: 'Meal plan updated successfully' });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
});

// Delete meal plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete meal plan items first
    await runQuery('DELETE FROM meal_plan_items WHERE meal_plan_id = ?', [id]);
    
    // Delete meal plan
    const result = await runQuery('DELETE FROM meal_plans WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
});

// Get meal plan statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await getAll(`
      SELECT 
        COUNT(*) as total_meal_plans,
        AVG(total_calories) as avg_calories,
        COUNT(DISTINCT name) as unique_plans
      FROM meal_plans
    `);

    const popularRecipes = await getAll(`
      SELECT r.title, COUNT(*) as usage_count
      FROM meal_plan_items mpi
      JOIN recipes r ON mpi.recipe_id = r.id
      GROUP BY r.id, r.title
      ORDER BY usage_count DESC
      LIMIT 10
    `);

    const mealTypeStats = await getAll(`
      SELECT meal_type, COUNT(*) as count
      FROM meal_plan_items
      GROUP BY meal_type
    `);

    res.json({
      overview: stats[0],
      popularRecipes,
      mealTypeStats
    });
  } catch (error) {
    console.error('Error fetching meal plan stats:', error);
    res.status(500).json({ error: 'Failed to fetch meal plan statistics' });
  }
});

module.exports = router; 