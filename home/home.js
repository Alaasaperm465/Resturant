const mealsSection = document.querySelector(".meals-grid");

function getAllCategories() {
    mealsSection.innerHTML=""
  let response = {};
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://www.themealdb.com/api/json/v1/1/categories.php",
    true
  );
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      response = JSON.parse(xhr.responseText);
    }
    const grid = document.createElement("div");
    grid.className = "list-grid";
    for (category of response["categories"]) {
      const btn = document.createElement("button");
      btn.className = "list-item";
      btn.type = "button";
      btn.textContent = category.strCategory;
      grid.appendChild(btn)

      btn.addEventListener("click",()=>getMealsForCategory(btn.textContent)
      )
    mealsSection.appendChild(grid)
  };
}
  xhr.send();

}

function getMealsForCategory(name){
     mealsSection.innerHTML = "";
     let meals = {};
     var req = new XMLHttpRequest();
     req.open(
       "GET",
       `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`,
       true
     );
     req.onreadystatechange = function () {
       if (this.readyState === 4 && this.status === 200) {
         meals = JSON.parse(req.responseText);
         for (meal of meals["meals"]) {
           const card = document.createElement("div");
           card.className = "meal-card";
           card.setAttribute("data-meal-id", meal.idMeal);
           card.innerHTML = `
          <div class="meal-image">
            <img src="${meal.strMealThumb || ""}" alt="${
             meal.strMeal || "Meal"
           }">
          </div>
          <div class="meal-content">
            <h3 class="meal-title">${meal.strMeal || "Unknown Meal"}</h3>
          </div>
        `;
           mealsSection.appendChild(card);
         }
       }
     };
     req.send();
}