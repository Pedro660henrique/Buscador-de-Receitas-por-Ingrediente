/*Selecionando o form do search-form(aonde está o input e o botão)*/
// e adicionando um evento de submit para capturar o valor do input
// e chamar a função searchRecipes com o valor do input como argumento
// A função searchRecipes faz uma requisição para a API do TheMealDB
const form= document.querySelector('.search-form')
const recipeList = document.querySelector('.recipe-list')
const recipeDetails = document.querySelector('.recipe-details')

// Adicionando um evento de submit no formulário, pesquisando a receita
// O evento é prevenido para não recarregar a página
// O valor do input é capturado e passado para a função searchRecipes
form.addEventListener('submit', function (event) {
    event.preventDefault()
    const inputValue = event.target[0].value

    if (inputValue) {
        searchRecipes(inputValue)
    }
})
// Adicionando um evento de click no botão de pesquisa, pesquisando a receita
async function searchRecipes(ingredient) {
    recipeList.innerHTML = `<p>Procurando receitas com "${ingredient}"...</p>`
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    const data = await response.json()

    if (data.meals) {
        showRecipes(data.meals)
    } else {
        recipeList.innerHTML = `<p>Nenhuma receita encontrada para "${ingredient}".</p>`
    }
}
// Função para exibir as receitas na tela
// A função recebe um array de receitas e cria um card para cada receita
function showRecipes(recipes) {
    // Limpa a lista de receitas antes de adicionar novas receitas/iNNERHTML serve para quando eu pegar a div depois tudo que vier depois do igual vai substituir o que já tem lá dentro
    recipeList.innerHTML = recipes.map(element => `
        <div class="recipe-card" onclick="getRecipeDetails(${element.idMeal})">

            <img src="${element.strMealThumb}" alt="receita-foto">
            <h2>${element.strMeal}</h2>
        </div>
        `
    ).join('');
}

async function getRecipeDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const recipe = data.meals[0];
    // Aqui você pode exibir os detalhes da receita
    let ingredients = ''

    for(let i = 1; i <= 20; i++) {
        // Verifica se o ingrediente existe e adiciona à string de ingredientes
        if (recipe[`strIngredient${i}`]) {
            ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`;
        } else {
            break; // Se não houver mais ingredientes, sai do loop
        }
    }

    recipeDetails.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt=${recipe.strMeal} class"recipe-img">
        <h3>Cartegoria: ${recipe.strCategory}</h3>
        <h3>Área: ${recipe.strArea}</h3>
        <ul>${ingredients}</ul>
        <h3>Instruções:</h3>
        <p>${recipe.strInstructions}</p>
        <p>Tags: ${recipe.strTags}</p>
        <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank">Assista no YouTube</a></p>
    `;
}