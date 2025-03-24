// Initialize ScrollReveal globally
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 1000,    // Reduced from 2000
    delay: 200,        // Reduced from 300
    reset: false
});

// Index page animations
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    sr.reveal('.home-text');
    sr.reveal('.highlight-content .text-center');
    sr.reveal('.highlight-content .image-container');
    sr.reveal('.highlight-content .welcome-card');
    sr.reveal('.popular-recipes h2');
    sr.reveal('.popular-recipes .row');
    sr.reveal('.popular-recipes .btn');
    sr.reveal('.banner', {
        distance: '100px',
        duration: 1500    // Reduced from 2500
    });
}

// Recipes page animations
if (window.location.pathname.includes('recipes.html')) {
    sr.reveal('h1.text-center');
    sr.reveal('.input-group', { delay: 100 });
    sr.reveal('.category-buttons', { delay: 200 });
    sr.reveal('.row.g-4', { delay: 300 });
    sr.reveal('.pagination', { delay: 400 });
}

// About page animations
if (window.location.pathname.includes('about.html')) {
    sr.reveal('.about-text', {
        origin: 'top',
        distance: '50px'
    });
    sr.reveal('.fs-1.fw-bold', { delay: 100 });
    sr.reveal('.fs-5', { delay: 200 });
    sr.reveal('.col-md-4', {
        origin: 'bottom',
        interval: 100,    // Reduced from 200
        delay: 300        // Reduced from 600
    });
    sr.reveal('.cooking-banner', {
        distance: '100px',
        duration: 1500,   // Reduced from 2500
        delay: 400        // Reduced from 800
    });
}

// After the About page animations and before footer animations
// Contact page animations
if (window.location.pathname.includes('contact.html')) {
    sr.reveal('h1.text-center', {
        origin: 'top',
        distance: '50px'
    });
    
    sr.reveal('.contact-info', {
        delay: 100
    });
    
    sr.reveal('.contact-form', {
        origin: 'right',
        delay: 200
    });
    
    sr.reveal('.contact-map', {
        origin: 'bottom',
        delay: 300
    });
}

// Footer animations for all pages
sr.reveal('.footer-section .col-md-4', { interval: 100 });  // Reduced from 200

$(document).ready(function() {
    // For index page popular recipes
    if ($('.popular-recipes').length) {
        $.getJSON('data/data.json')
            .done(function(data) {
                const popularRecipes = data.recipes.slice(0, 3);
                displayPopularRecipes(popularRecipes);
            })
            .fail(function(error) {
                console.error('Error loading recipes:', error);
            });
    }

    // For recipes page
    if (window.location.pathname.includes('recipes.html')) {
        let recipes = [];
        const recipesPerPage = 6;
        let currentPage = 1;

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
    }

    function displayPopularRecipes(recipes) {
        const recipeCards = recipes.map(recipe => `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <span class="badge ${recipe.badge.class} mb-2">${recipe.badge.text}</span>
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="far fa-clock me-1"></i>${recipe.cookTime}
                                <i class="fas fa-user-friends ms-3 me-1"></i>${recipe.servings} servings
                            </small>
                        </div>
                        <a href="detail_recipe.html?id=${recipe.id}" class="btn btn-outline-primary mt-3 w-100">View Recipe</a>
                    </div>
                </div>
            </div>
        `).join('');

        $('.popular-recipes .row.g-4').html(recipeCards);
    }
});
