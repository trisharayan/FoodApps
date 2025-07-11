const express = require('express');
const router = express.Router();
const OpenAIService = require('../services/openai');
const { runQuery, getRow } = require('../database');

// Generate recipe with AI
router.post('/generate-recipe', async (req, res) => {
  try {
    const { prompt, preferences } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Recipe prompt is required' });
    }

    const recipe = await OpenAIService.generateRecipe(prompt, preferences);
    res.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

// Analyze nutrition of ingredients
router.post('/analyze-nutrition', async (req, res) => {
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

// Generate meal plan
router.post('/generate-meal-plan', async (req, res) => {
  try {
    const { preferences, days } = req.body;

    if (!preferences) {
      return res.status(400).json({ error: 'Preferences are required' });
    }

    const mealPlan = await OpenAIService.generateMealPlan(preferences, days || 7);
    res.json(mealPlan);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// Get cooking tips for a recipe
router.post('/cooking-tips', async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({ error: 'Recipe is required' });
    }

    const tips = await OpenAIService.getCookingTips(recipe);
    res.json(tips);
  } catch (error) {
    console.error('Error getting cooking tips:', error);
    res.status(500).json({ error: 'Failed to get cooking tips' });
  }
});

// Suggest ingredient substitutions
router.post('/substitutions', async (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient is required' });
    }

    const substitutions = await OpenAIService.suggestSubstitutions(ingredient);
    res.json(substitutions);
  } catch (error) {
    console.error('Error suggesting substitutions:', error);
    res.status(500).json({ error: 'Failed to suggest substitutions' });
  }
});

// Generate recipe variations
router.post('/recipe-variations', async (req, res) => {
  try {
    const { recipe, variationType } = req.body;

    if (!recipe) {
      return res.status(400).json({ error: 'Recipe is required' });
    }

    const prompt = `Create ${variationType || '3'} variations of this recipe: ${recipe.title}. 
    Consider different cooking methods, ingredient substitutions, or flavor profiles.
    
    Return JSON with:
    {
      "variations": [
        {
          "title": "Variation Title",
          "description": "What makes this variation unique",
          "changes": ["change1", "change2"],
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"]
        }
      ]
    }`;

    const completion = await OpenAIService.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative chef who specializes in recipe variations." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    const variations = JSON.parse(response);
    res.json(variations);
  } catch (error) {
    console.error('Error generating recipe variations:', error);
    res.status(500).json({ error: 'Failed to generate recipe variations' });
  }
});

// Get recipe recommendations based on preferences
router.post('/recommendations', async (req, res) => {
  try {
    const { preferences, limit = 5 } = req.body;

    if (!preferences) {
      return res.status(400).json({ error: 'Preferences are required' });
    }

    const prompt = `Based on these preferences: ${JSON.stringify(preferences)}, 
    suggest ${limit} recipe ideas that would be perfect for this user.
    
    Return JSON with:
    {
      "recommendations": [
        {
          "title": "Recipe Title",
          "description": "Why this recipe is recommended",
          "match_score": 0.95,
          "cuisine": "cuisine type",
          "difficulty": "easy/medium/hard",
          "cooking_time": "estimated time"
        }
      ]
    }`;

    const completion = await OpenAIService.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a culinary expert who understands user preferences and can recommend perfect recipes." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    const recommendations = JSON.parse(response);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Analyze recipe complexity and suggest improvements
router.post('/analyze-recipe', async (req, res) => {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({ error: 'Recipe is required' });
    }

    const prompt = `Analyze this recipe and provide detailed feedback:
    
    Recipe: ${recipe.title}
    Ingredients: ${recipe.ingredients?.join(', ') || 'N/A'}
    Instructions: ${recipe.instructions?.join(' ') || 'N/A'}
    
    Return JSON with:
    {
      "complexity_score": 0.75,
      "difficulty_level": "medium",
      "time_accuracy": "accurate/underestimated/overestimated",
      "ingredient_analysis": {
        "missing_common_ingredients": ["ingredient1"],
        "unusual_ingredients": ["ingredient2"],
        "substitution_opportunities": ["substitution1"]
      },
      "instruction_analysis": {
        "clarity_score": 0.8,
        "missing_steps": ["step1"],
        "unclear_instructions": ["instruction1"]
      },
      "improvements": ["improvement1", "improvement2"],
      "nutrition_notes": "nutritional considerations",
      "cooking_tips": ["tip1", "tip2"]
    }`;

    const completion = await OpenAIService.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a recipe analyst who can evaluate recipes for clarity, accuracy, and improvement opportunities." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    const analysis = JSON.parse(response);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing recipe:', error);
    res.status(500).json({ error: 'Failed to analyze recipe' });
  }
});

module.exports = router; 