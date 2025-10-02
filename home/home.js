document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    const action = item.getAttribute("data-action");
    if (action === "home") {
      getAllMeals();
    } else if (action === "categories") {
      getAllCategories();
    } else if (action === "ingredients") {
      getAllIngredients();
    } else if (action === "areas") {
      getAllAreas();
    }
  });
});

const mealsSection = document.querySelector(".meals-grid");

//Get all categories 
function getAllCategories() {
  mealsSection.innerHTML = "";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/categories.php", true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const grid = document.createElement("div");
      grid.className = "list-grid";

      for (let category of response["categories"]) {
        const btn = document.createElement("button");
        btn.className = "list-item";
        btn.type = "button";
        btn.textContent = category.strCategory;
        btn.addEventListener("click", () => getMealsForCategory(btn.textContent));
        grid.appendChild(btn);
      }
      mealsSection.appendChild(grid);
    }
  };
  xhr.send();
}

// Get all areas 
function getAllAreas() {
  mealsSection.innerHTML = "";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/list.php?a=list", true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const grid = document.createElement("div");
      grid.className = "list-grid";

      for (let area of response["meals"]) {
        const btn = document.createElement("button");
        btn.className = "list-item";
        btn.type = "button";
        btn.textContent = area.strArea;
        btn.addEventListener("click", () => getMealsForArea(btn.textContent));
        grid.appendChild(btn);
      }
      mealsSection.appendChild(grid);
    }
  };
  xhr.send();
}

// Get all ingredients 
function getAllIngredients() {
  mealsSection.innerHTML = "";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/list.php?i=list", true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const grid = document.createElement("div");
      grid.className = "list-grid";

      for (let ing of response["meals"]) {
        const btn = document.createElement("button");
        btn.className = "list-item";
        btn.type = "button";
        btn.textContent = ing.strIngredient;
        btn.addEventListener("click", () => getMealsForIngredient(btn.textContent));
        grid.appendChild(btn);
      }
      mealsSection.appendChild(grid);
    }
  };
  xhr.send();
}

//  Home all meals
function getAllMeals() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.themealdb.com/api/json/v1/1/search.php?s=", true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhr.responseText);
      renderMeals(response["meals"]);
    }
  };
  xhr.send();
}

//  Helpers to get meals by filters 
function getMealsForCategory(name) {
  getMealsByUrl(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
}
function getMealsForArea(name) {
  getMealsByUrl(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`);
}
function getMealsForIngredient(name) {
  getMealsByUrl(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`);
}

function getMealsByUrl(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(xhr.responseText);
      renderMeals(response["meals"]);
    }
  };
  xhr.send();
}

const searchMealInput = document.getElementById("searchMealsInput");

searchMealInput.addEventListener("input", (e) => {
  if (e.target.value.trim().length > 0) {
    getMealsByUrl(`https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`)
  }
})

//  Render meals list 
function renderMeals(meals) {
  mealsSection.innerHTML = "";
  if (!meals || meals.length === 0) {
    mealsSection.innerHTML = "<p>No meals found.</p>";
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "meal-card";
    card.setAttribute("data-meal-id", meal.idMeal);
    card.innerHTML = `
      <div class="meal-image">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <div class="meal-content">
        <h3>${meal.strMeal}</h3>
      </div>
    `;

    //  click to show details
    card.addEventListener("click", () => {
      showMealDetails(meal.idMeal);
    });

    mealsSection.appendChild(card);
  });
}

//  Show one meal details 
function showMealDetails(mealId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`, true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.responseText);
      console.log(data);
      
      if (data.meals && data.meals.length > 0) {
        renderMealDetails(data.meals[0]);
      }
    }
  };
  xhr.send();
}

//  Render meal details 
function renderMealDetails(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing.trim().length > 0 && measure.trim().length > 0) {
      ingredients.push(`${measure} - ${ing}`);
    }
  }

  mealsSection.innerHTML = `
      <div class="meal-details-section">
        <button class="back-button" onclick="getAllMeals()">
          <i class="fas fa-arrow-left"></i> Back to Meals
        </button>
        
        <div class="meal-details-card">
          <div class="meal-details-header">
            <div class="meal-details-image">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div class="meal-details-card">
            <div>
              <button class="order-button">
              <a href="../login/login.html">Order</a>
              </button>
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
                    <span class="ingredient-name">${ing}</span>
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

//  Start app by showing all meals 
getAllMeals();
