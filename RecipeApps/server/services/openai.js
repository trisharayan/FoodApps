const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  static async generateRecipe(prompt, preferences = {}) {
    try {
      const systemPrompt = `You are a professional chef and nutritionist. Create detailed, delicious recipes based on user requests. 
      
      Always include:
      - Clear, step-by-step instructions
      - Exact measurements and ingredients
      - Cooking time and difficulty level
      - Nutritional information (calories, protein, carbs, fat)
      - Serving size
      
      Consider dietary preferences: ${JSON.stringify(preferences)}
      
      Format the response as JSON with these fields:
      {
        "title": "Recipe Title",
        "description": "Brief description",
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "instructions": ["step 1", "step 2", ...],
        "prep_time": minutes,
        "cook_time": minutes,
        "servings": number,
        "difficulty": "easy/medium/hard",
        "cuisine": "cuisine type",
        "tags": ["tag1", "tag2", ...],
        "nutrition": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number,
          "sugar": number,
          "sodium": number
        }
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating recipe:', error);
      throw new Error('Failed to generate recipe');
    }
  }

  static async analyzeNutrition(ingredients) {
    try {
      const prompt = `Analyze the nutritional content of these ingredients and provide detailed nutritional information per serving:
      
      Ingredients: ${ingredients.join(', ')}
      
      Return JSON with:
      {
        "calories": number,
        "protein": number (grams),
        "carbs": number (grams),
        "fat": number (grams),
        "fiber": number (grams),
        "sugar": number (grams),
        "sodium": number (mg)
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a nutritionist. Provide accurate nutritional analysis." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      throw new Error('Failed to analyze nutrition');
    }
  }

  static async generateMealPlan(preferences, days = 7) {
    try {
      const systemPrompt = `You are a meal planning expert. Create a ${days}-day meal plan based on user preferences.
      
      Consider:
      - Dietary restrictions: ${preferences.dietary || 'none'}
      - Calorie target: ${preferences.calories || 2000} per day
      - Cuisine preferences: ${preferences.cuisine || 'any'}
      - Cooking skill level: ${preferences.skillLevel || 'intermediate'}
      
      Return JSON with:
      {
        "name": "Meal Plan Name",
        "description": "Brief description",
        "total_calories": number,
        "days": [
          {
            "day": "Monday",
            "meals": {
              "breakfast": { "recipe": "Recipe Name", "calories": number },
              "lunch": { "recipe": "Recipe Name", "calories": number },
              "dinner": { "recipe": "Recipe Name", "calories": number },
              "snack": { "recipe": "Recipe Name", "calories": number }
            }
          }
        ]
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate a meal plan" }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  static async getCookingTips(recipe) {
    try {
      const prompt = `Provide helpful cooking tips and variations for this recipe:
      
      Recipe: ${recipe.title}
      Ingredients: ${recipe.ingredients.join(', ')}
      Instructions: ${recipe.instructions.join(' ')}
      
      Return JSON with:
      {
        "tips": ["tip1", "tip2", "tip3"],
        "variations": ["variation1", "variation2"],
        "substitutions": ["sub1", "sub2"],
        "storage": "storage tips",
        "reheating": "reheating instructions"
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a cooking expert providing helpful tips and advice." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error getting cooking tips:', error);
      throw new Error('Failed to get cooking tips');
    }
  }

  static async suggestSubstitutions(ingredient) {
    try {
      const prompt = `Suggest healthy and practical substitutions for: ${ingredient}
      
      Return JSON with:
      {
        "original": "original ingredient",
        "substitutions": [
          {
            "ingredient": "substitution name",
            "ratio": "substitution ratio",
            "notes": "any special notes"
          }
        ]
      }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a cooking expert providing ingredient substitutions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('Error suggesting substitutions:', error);
      throw new Error('Failed to suggest substitutions');
    }
  }
}

module.exports = OpenAIService; 