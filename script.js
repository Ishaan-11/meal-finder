const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    resultHeading = document.getElementById('result-heading'),
    mealsEl = document.getElementById('meals'),
    single_mealEl = document.getElementById('single-meal');


// fetch data from APi
async function getDataFromApi(url) {
  const response = await fetch(url);
  return response.json();
}

// Search meal and fetch from API
async function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    const data = await getDataFromApi(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);

    resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

    if (data.meals === null) {
      resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
    } else {
      mealsEl.innerHTML = data.meals
        .map(meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>`)
        .join('');
    }
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by ID
async function getMealById(mealId) {
  const data = await getDataFromApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const [ meal ] = data.meals;

  addMealToDOM(meal);
}

// get random meal
async function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  const data = await getDataFromApi(`https://www.themealdb.com/api/json/v1/1/random.php`);
  const [ meal ] = data.meals;

  addMealToDOM(meal);
}

// Add meal to DOM
function  addMealToDOM(meal) {
  let ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

}

// event listners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const meal = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (meal) {
    const mealId = meal.getAttribute('data-mealid');
    getMealById(mealId);
  }
});