    // Page elements
    const categorySelect = document.getElementById("categories");
    const areaSelect = document.getElementById("areas");
    const ingredientSelect = document.getElementById("ingredients");
    const mealsSection = document.querySelector(".meals-grid");

    // Navbar items
    const navItems = document.querySelectorAll('.nav-item[data-action]');

    // APIs
    const API_BASE = "https://www.themealdb.com/api/json/v1/1/";
    const LIST_URLS = {
      categories: API_BASE + "list.php?c=list",
      areas: API_BASE + "list.php?a=list", 
      ingredients: API_BASE + "list.php?i=list"
    };
    const FILTER_URLS = {
      categories: v => API_BASE + `filter.php?c=${encodeURIComponent(v)}`,
      areas: v => API_BASE + `filter.php?a=${encodeURIComponent(v)}`,
      ingredients: v => API_BASE + `filter.php?i=${encodeURIComponent(v)}`
    };

    // General function using XMLHttpRequest
    function fetchData(url, callback) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              callback(data);
            } catch (err) {
              console.error("JSON parse error", err);
              callback(null);
            }
          } else {
            console.error("Request failed:", url, xhr.status);
            callback(null);
          }
        }
      };
      xhr.send();
    }

    // Render meals
    function renderMeals(meals) {
      mealsSection.innerHTML = "";
      if (!meals || meals.length === 0) {
        mealsSection.innerHTML = "<p style='text-align: center; color: var(--text-secondary); font-size: 1.2rem; margin-top: 2rem;'>No meals found.</p>";
        return;
      }
      meals.forEach(meal => {
        const card = document.createElement("div");
        card.className = "meal-card";
        card.setAttribute("data-meal-id", meal.idMeal);
        card.innerHTML = `
          <div class="meal-image">
            <img src="${meal.strMealThumb || ''}" alt="${meal.strMeal || 'Meal'}">
          </div>
          <div class="meal-content">
            <h3 class="meal-title">${meal.strMeal || 'Unknown Meal'}</h3>
          </div>
        `;
        
        // Add event listener to open details on card click
        card.addEventListener("click", () => {
          showMealDetails(meal.idMeal);
        });
        
        mealsSection.appendChild(card);
      });
    }

    // Show meal details
    function showMealDetails(mealId) {
      const detailsUrl = API_BASE + `lookup.php?i=${mealId}`;
      fetchData(detailsUrl, data => {
        if (!data || !data.meals || data.meals.length === 0) {
          console.error("Meal details not found");
          return;
        }
        
        const meal = data.meals[0];
        renderMealDetails(meal);
      });
    }

    // Render meal details
    function renderMealDetails(meal) {
      // Collect ingredients and measures
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push({
            name: ingredient,
            measure: measure ? measure.trim() : ""
          });
        }
      }

      mealsSection.innerHTML = `
        <div class="meal-details-section">
          <button class="back-button" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Back to Meals
          </button>
          
          <div class="meal-details-card">
            <div class="meal-details-header">
              <div class="meal-details-image">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              </div>
              <div class="meal-details-info">
                <h1 class="meal-details-title">${meal.strMeal}</h1>
                <div class="meal-meta">
                  <span class="meal-category">
                    <i class="fas fa-tag"></i> ${meal.strCategory}
                  </span>
                  <span class="meal-area">
                    <i class="fas fa-map-marker-alt"></i> ${meal.strArea}
                  </span>
                </div>
                ${meal.strTags ? `
                  <div class="meal-tags">
                    ${meal.strTags.split(',').map(tag => 
                      `<span class="tag">${tag.trim()}</span>`
                    ).join('')}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="meal-details-content">
              <div class="ingredients-section">
                <h3><i class="fas fa-list"></i> Ingredients</h3>
                <div class="ingredients-grid">
                  ${ingredients.map(ing => `
                    <div class="ingredient-item">
                      <span class="ingredient-name">${ing.name}</span>
                      <span class="ingredient-measure">${ing.measure}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="instructions-section">
                <h3><i class="fas fa-utensils"></i> Instructions</h3>
                <div class="instructions-text">
                  ${meal.strInstructions.replace(/\n/g, '<br><br>')}
                </div>
              </div>

              ${meal.strYoutube ? `
                <div class="video-section">
                  <h3><i class="fab fa-youtube"></i> Video Tutorial</h3>
                  <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}" 
                            frameborder="0" allowfullscreen></iframe>
                  </div>
                </div>
              ` : ''}

              ${meal.strSource ? `
                <div class="source-section">
                  <a href="${meal.strSource}" target="_blank" class="source-link">
                    <i class="fas fa-external-link-alt"></i> View Original Recipe
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Display meals from a given URL
    function displayMealsByUrl(url) {
      fetchData(url, data => {
        if (!data) return renderMeals([]);
        renderMeals(data.meals || []);
      });
    }

    // Fetch and render list (Categories/Areas/Ingredients)
    function fetchAndRenderList(type) {
      const url = LIST_URLS[type];
      fetchData(url, data => {
        mealsSection.innerHTML = "";
        if (!data || !Array.isArray(data.meals)) {
          mealsSection.innerHTML = "<p style='text-align: center; color: var(--text-secondary);'>No items found.</p>";
          return;
        }

        // Create a grid of items
        const grid = document.createElement("div");
        grid.className = "list-grid";

        data.meals.forEach(item => {
          // Get the correct field based on type
          let name = "";
          if (type === "categories") name = item.strCategory;
          else if (type === "areas") name = item.strArea;
          else if (type === "ingredients") name = item.strIngredient;

          const btn = document.createElement("button");
          btn.className = "list-item";
          btn.type = "button";
          btn.textContent = name;
          
          // On click filter meals by selected item
          btn.addEventListener("click", () => {
            if (type === "categories") {
              displayMealsByUrl(FILTER_URLS.categories(name));
              categorySelect.value = name;
            }
            if (type === "areas") {
              displayMealsByUrl(FILTER_URLS.areas(name));
              areaSelect.value = name;
            }
            if (type === "ingredients") {
              displayMealsByUrl(FILTER_URLS.ingredients(name));
              ingredientSelect.value = name;
            }
          });

          grid.appendChild(btn);
        });

        mealsSection.appendChild(grid);
      });
    }

    // Load options into select elements
    function loadSelectOptions(selectEl, listUrl, keyName) {
      fetchData(listUrl, data => {
        if (!data || !Array.isArray(data.meals)) return;
        
        // Add options
        data.meals.forEach(item => {
          const opt = document.createElement("option");
          opt.value = item[keyName];
          opt.textContent = item[keyName];
          selectEl.appendChild(opt);
        });
      });
    }

    // Events for select elements
    categorySelect.addEventListener("change", function () {
      const v = this.value;
      if (!v) {
        // "All Categories" - show categories list
        fetchAndRenderList("categories");
      } else {
        // Filter by selected category
        displayMealsByUrl(FILTER_URLS.categories(v));
      }
    });

    areaSelect.addEventListener("change", function () {
      const v = this.value;
      if (!v) {
        fetchAndRenderList("areas");
      } else {
        displayMealsByUrl(FILTER_URLS.areas(v));
      }
    });

    ingredientSelect.addEventListener("change", function () {
      const v = this.value;
      if (!v) {
        fetchAndRenderList("ingredients");
      } else {
        displayMealsByUrl(FILTER_URLS.ingredients(v));
      }
    });

    // Events for navbar items
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        
        // Reset selects
        categorySelect.value = "";
        areaSelect.value = "";
        ingredientSelect.value = "";
        
        // Show requested list
        fetchAndRenderList(action);
      });
    });

    // Search functionality
    const searchBox = document.querySelector(".search-box");
    if (searchBox) {
      searchBox.addEventListener("keyup", e => {
        if (e.key === "Enter") {
          const q = e.target.value.trim();
          displayMealsByUrl(API_BASE + "search.php?s=" + encodeURIComponent(q));
        }
      });
    }

    // Initialization on page load
    window.addEventListener("load", () => {
      // Load select options
      loadSelectOptions(categorySelect, LIST_URLS.categories, "strCategory");
      loadSelectOptions(areaSelect, LIST_URLS.areas, "strArea");
      loadSelectOptions(ingredientSelect, LIST_URLS.ingredients, "strIngredient");

      // Show default meals
      displayMealsByUrl(API_BASE + "search.php?s=");
    });



    //----------------------------------------------------------------------//

    /* 
    const API_BASE = "https://www.themealdb.com/api/json/v1/1/";

    const LIST_URLS = {
      categories: API_BASE + "list.php?c=list",
      areas: API_BASE + "list.php?a=list", 
      ingredients: API_BASE + "list.php?i=list"
    };

    const FILTER_URLS = {
      categories: v => API_BASE + `filter.php?c=${encodeURIComponent(v)}`,
      areas: v => API_BASE + `filter.php?a=${encodeURIComponent(v)}`,
      ingredients: v => API_BASE + `filter.php?i=${encodeURIComponent(v)}`
    };

    const detailsUrl = API_BASE + `lookup.php?i=${mealId}`;

    */


/*
1- (basic api) const API_BASE = "https://www.themealdb.com/api/json/v1/1/";
2- ( search by name )displayMealsByUrl(API_BASE + "search.php?s=" + encodeURIComponent(q)); 
3- (categories ) LIST_URLS categories  + FILTER_URLS categories, 
4- (areas ) LIST_URLS areas + FILTER_URLS areas
5- (ingredients ) LIST_URLS ingredients + FILTER_URLS ingredients
6- (meal deatil) const detailsUrl = API_BASE + `lookup.php?i=${mealId}`;
*/





























