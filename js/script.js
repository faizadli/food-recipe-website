$(document).ready(function() {
    let recipes = [];
    const recipesPerPage = 6;
    let currentPage = 1;

    // Fetch recipes data
    $.getJSON('data/data.json')
        .done(function(data) {
            recipes = data.recipes;
            filterRecipes('all');
        })
        .fail(function(error) {
            console.error('Error loading recipes:', error);
        });

    // Category filter
    $('.category-buttons button').on('click', function() {
        $('.category-buttons button').removeClass('active');
        $(this).addClass('active');
        currentPage = 1;
        const category = $(this).text().toLowerCase();
        filterRecipes(category);
    });

    // Search functionality
    $('.input-group input').on('input', function() {
        currentPage = 1;
        const searchTerm = $(this).val().toLowerCase();
        const activeCategory = $('.category-buttons button.active').text().toLowerCase();
        filterRecipes(activeCategory, searchTerm);
    });

    // Pagination click handler
    $('.pagination').on('click', '.page-link', function(e) {
        e.preventDefault();
        const $pageItem = $(this).parent();
        
        if (!$pageItem.hasClass('disabled') && !$pageItem.hasClass('active')) {
            const text = $(this).text();
            if (text === 'Previous') {
                currentPage--;
            } else if (text === 'Next') {
                currentPage++;
            } else {
                currentPage = parseInt(text);
            }
            
            const activeCategory = $('.category-buttons button.active').text().toLowerCase();
            const searchTerm = $('.input-group input').val().toLowerCase();
            filterRecipes(activeCategory, searchTerm);
        }
    });

    function filterRecipes(category, searchTerm = '') {
        let filteredRecipes = recipes;

        if (category !== 'all') {
            filteredRecipes = recipes.filter(recipe => recipe.category === category);
        }

        if (searchTerm) {
            filteredRecipes = filteredRecipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchTerm) ||
                recipe.description.toLowerCase().includes(searchTerm)
            );
        }

        displayPagination(filteredRecipes.length);
        displayRecipes(filteredRecipes);
    }

    function displayRecipes(recipesToShow) {
        const start = (currentPage - 1) * recipesPerPage;
        const end = start + recipesPerPage;
        const paginatedRecipes = recipesToShow.slice(start, end);

        const recipeCards = paginatedRecipes.map(recipe => `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <span class="badge ${recipe.badge.class} mb-2">${recipe.badge.text}</span>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="far fa-clock"></i> ${recipe.cookTime}
                                <i class="fas fa-user ms-3"></i> ${recipe.servings} servings
                            </div>
                            <a href="detail_recipe.html?id=${recipe.id}" class="btn btn-outline-primary">View Recipe</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        $('.row.g-4').html(recipeCards);
    }

    function displayPagination(totalRecipes) {
        const totalPages = Math.ceil(totalRecipes / recipesPerPage);
        let paginationHTML = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" tabindex="-1">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `;
        }

        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"> 
                <a class="page-link" href="#">Next</a>
            </li>
        `;

        $('.pagination').html(paginationHTML);
    }
});