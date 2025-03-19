$(document).ready(function() {
    // Get recipe ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));

    // Fetch recipe data
    $.getJSON('data/data.json')
        .done(function(data) {
            const recipe = data.recipes.find(r => r.id === recipeId);
            if (recipe) {
                displayRecipeDetails(recipe);
            } else {
                window.location.href = 'recipes.html';
            }
        })
        .fail(function(error) {
            console.error('Error loading recipe:', error);
            window.location.href = 'recipes.html';
        });

    function displayRecipeDetails(recipe) {
        // Update page title
        document.title = `${recipe.title} - Recipe Website`;
        
        // Update breadcrumb and header
        $('#recipe-title, #recipe-title-header').text(recipe.title);
        
        // Update image
        $('#recipe-image').attr({
            src: recipe.image,
            alt: recipe.title
        });
        
        // Update recipe info
        $('#recipe-description').text(recipe.description);
        $('#prep-time').text(`Prep: ${recipe.prepTime}`);
        $('#cook-time').text(`Cook: ${recipe.cookTime}`);
        $('#servings').text(`Serves: ${recipe.servings}`);
        $('#difficulty').text(`Difficulty: ${recipe.difficulty}`);
        
        // Update badge
        $('.recipe-badge')
            .text(recipe.badge.text)
            .addClass(recipe.badge.class);
        
        // Update nutrition info
        $('#calories').text(recipe.nutritionInfo.calories);
        $('#protein').text(recipe.nutritionInfo.protein);
        $('#carbs').text(recipe.nutritionInfo.carbs);
        $('#fat').text(recipe.nutritionInfo.fat);
        
        // Update ingredients
        const ingredientsList = recipe.ingredients
            .map(ingredient => `<li>${ingredient}</li>`)
            .join('');
        $('#ingredients-list').html(ingredientsList);
        
        // Update instructions
        const instructionsList = recipe.instructions
            .map(instruction => `<li>${instruction}</li>`)
            .join('');
        $('#instructions-list').html(instructionsList);
    }
});