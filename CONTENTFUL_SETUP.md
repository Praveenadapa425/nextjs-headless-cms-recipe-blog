# Contentful CMS Setup Guide

## 📋 Content Model: Recipe

### Fields Configuration:

1. **title** (Short text)
   - ID: `title`
   - Type: Short text
   - Enable localization: ✅ YES
   - Required: ✅ YES

2. **slug** (Short text)
   - ID: `slug`
   - Type: Short text
   - Enable localization: ❌ NO
   - Required: ✅ YES
   - Unique: ✅ YES

3. **description** (Rich text)
   - ID: `description`
   - Type: Rich text
   - Enable localization: ✅ YES
   - Required: ✅ YES

4. **ingredients** (Rich text)
   - ID: `ingredients`
   - Type: Rich text
   - Enable localization: ✅ YES
   - Required: ✅ YES

5. **instructions** (Rich text)
   - ID: `instructions`
   - Type: Rich text
   - Enable localization: ✅ YES
   - Required: ✅ YES

6. **featuredImage** (Media)
   - ID: `featuredImage`
   - Type: Media
   - Enable localization: ❌ NO
   - Required: ❌ NO

7. **category** (Reference)
   - ID: `category`
   - Type: Reference
   - Validation: Accept only specified entry type
   - Required: ❌ NO

8. **difficulty** (Short text)
   - ID: `difficulty`
   - Type: Short text
   - Enable localization: ❌ NO
   - Required: ✅ YES
   - Validation: Predefined values (Beginner, Intermediate, Advanced)

9. **cookingTime** (Number)
   - ID: `cookingTime`
   - Type: Number
   - Enable localization: ❌ NO
   - Required: ✅ YES
   - Unit: minutes

10. **isFeatured** (Boolean)
    - ID: `isFeatured`
    - Type: Boolean
    - Enable localization: ❌ NO
    - Required: ❌ NO
    - Default value: false

## 🌍 Localization Setup

### Enable Localization:
1. Go to Settings → Locales
2. Add the following locales:
   - English (en-US) - Default
   - Spanish (es-ES)
   - French (fr-FR)

### For Each Localized Field:
- Enable "Enable localization" checkbox
- This allows content editors to provide translations for each supported language

## 📝 Sample Recipes to Create

### Recipe 1: Classic Chocolate Chip Cookies

**English (en-US):**
- Title: "Classic Chocolate Chip Cookies"
- Slug: "classic-chocolate-chip-cookies"
- Description: "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside."
- Ingredients: "2¼ cups all-purpose flour, 1 tsp baking soda, 1 tsp salt, 1 cup butter, ¾ cup granulated sugar, ¾ cup brown sugar, 2 large eggs, 2 tsp vanilla extract, 2 cups chocolate chips"
- Instructions: "1. Preheat oven to 375°F. 2. Mix flour, baking soda, and salt. 3. Cream butter and sugars. 4. Add eggs and vanilla. 5. Gradually mix in flour mixture. 6. Stir in chocolate chips. 7. Drop spoonfuls onto baking sheet. 8. Bake 9-11 minutes."

**Spanish (es-ES):**
- Title: "Galletas Clásicas con Chispas de Chocolate"
- Description: "Deliciosas galletas caseras con chispas de chocolate que están crujientes por fuera y masticables por dentro."
- Ingredients: "2¼ tazas de harina para todo uso, 1 cucharadita de bicarbonato de sodio, 1 cucharadita de sal, 1 taza de mantequilla, ¾ taza de azúcar granulada, ¾ taza de azúcar morena, 2 huevos grandes, 2 cucharaditas de extracto de vainilla, 2 tazas de chispas de chocolate"
- Instructions: "1. Precalienta el horno a 190°C. 2. Mezcla harina, bicarbonato y sal. 3. Crea una crema con mantequilla y azúcares. 4. Añade huevos y vainilla. 5. Mezcla gradualmente la mezcla de harina. 6. Agrega las chispas de chocolate. 7. Coloca cucharadas en la bandeja. 8. Hornea 9-11 minutos."

**French (fr-FR):**
- Title: "Cookies Classiques aux Pépites de Chocolat"
- Description: "Délicieux cookies maison aux pépites de chocolat croustillants à l'extérieur et moelleux à l'intérieur."
- Ingredients: "2¼ tasses de farine tout usage, 1 c. à café de bicarbonate de soude, 1 c. à café de sel, 1 tasse de beurre, ¾ tasse de sucre granulé, ¾ tasse de sucre brun, 2 gros œufs, 2 c. à café d'extrait de vanille, 2 tasses de pépites de chocolat"
- Instructions: "1. Préchauffez le four à 190°C. 2. Mélangez farine, bicarbonate et sel. 3. Créez une crème avec beurre et sucres. 4. Ajoutez œufs et vanille. 5. Mélangez progressivement le mélange de farine. 6. Incorporez les pépites de chocolat. 7. Déposez des cuillerées sur la plaque. 8. Enfournez 9-11 minutes."

### Recipe 2: Italian Margherita Pizza

**English (en-US):**
- Title: "Authentic Italian Margherita Pizza"
- Slug: "italian-margherita-pizza"
- Description: "Traditional Neapolitan pizza with fresh mozzarella, basil, and San Marzano tomatoes."
- Ingredients: "Pizza dough, 8 oz fresh mozzarella, 1 cup San Marzano tomatoes, Fresh basil leaves, Extra virgin olive oil, Salt"
- Instructions: "1. Preheat oven to 500°F. 2. Roll out pizza dough. 3. Spread tomato sauce evenly. 4. Add torn mozzarella pieces. 5. Bake for 8-10 minutes. 6. Top with fresh basil. 7. Drizzle with olive oil."

### Recipe 3: Japanese Chicken Teriyaki

**English (en-US):**
- Title: "Japanese Chicken Teriyaki"
- Slug: "japanese-chicken-teriyaki"
- Description: "Sweet and savory glazed chicken with traditional Japanese flavors."
- Ingredients: "1 lb chicken thighs, ¼ cup soy sauce, 2 tbsp mirin, 2 tbsp sake, 1 tbsp sugar, 1 tsp ginger, 1 clove garlic"
- Instructions: "1. Mix sauce ingredients. 2. Marinate chicken for 30 minutes. 3. Cook chicken in sauce until glazed. 4. Serve with rice and vegetables."

## 🔧 API Integration

### Required Environment Variables:
```env
CMS_PROVIDER=contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### Contentful API Setup:
1. Create a Contentful account at https://www.contentful.com/
2. Create a new space for your recipe blog
3. Note your Space ID from Settings → General Settings
4. Create an API key:
   - Go to Settings → API keys
   - Create new API key
   - Copy the Space ID and Access Token
5. Update your `.env.local` file with actual values

## 🚀 Next Steps

1. Complete Contentful setup as described above
2. Create the Recipe content model
3. Add the 3 sample recipes with translations
4. Update your `.env.local` with real Contentful credentials
5. Install Contentful SDK: `npm install contentful`
6. Create API integration files in your project

The setup will enable your recipe blog to fetch content dynamically from Contentful CMS with full internationalization support.