import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON, sendJSON } from "./helpers";
//Model is all about the data in the app
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1
    },
    bookmarks: []
};

export const loadRecipe = async(recipeID) => {
    try{
        const data = await getJSON(`${API_URL}${recipeID}`)
        
        const { recipe } = data.data;
        state.recipe = { //Update state.recipe from object above
            recipeID: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };
        if(state.bookmarks.some(bookmark => bookmark.id === recipeID)){ //If a recipe is in the bookmarks array mark relevant results as bookmarked
            state.recipe.bookmarked = true;
        }
        else state.recipe.bookmarked = false;
    } catch (err){
        console.error(err)
        throw err;
    }
}

export const loadSearchResults = async(query) => {
    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}}`)

        state.search.results = data.data.recipes.map((recipe) => {
            return {
                recipeID: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            }
        })
        state.search.page = 1; //reset the page number when a new search is made
    } catch(err){
        console.error(err)
        throw err;
    }
}

//Results pagination
export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page;

    const start = (page-1) * state.search.resultsPerPage; //show 10 results per page
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
}

export const updateServings = (numberOfServings) => {
    state.recipe.ingredients.forEach((el) => {
        el.quantity = (el.quantity * numberOfServings) / state.recipe.servings; //New quantity = oldQuantity * newNumberOfServings/oldNumberOfSavings
    });

    state.recipe.servings = numberOfServings;
}

const persistBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = (recipe) => {
     //Add bookmark
    state.bookmarks.push(recipe)

    //Mark current recipe as bookmarked
    if(recipe.recipeID === state.recipe.recipeID) state.recipe.bookmarked = true;

    persistBookmarks();
}

export const deleteBookmark = (recipeID) => {
    const index = state.bookmarks.findIndex(el => el.recipeID === recipeID)
    state.bookmarks.splice(index, 1)
    if(recipeID === state.recipe.recipeID) state.recipe.bookmarked = false;

    persistBookmarks()
}

const init = () => {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}

const clearBookmarks = () => localStorage.clear('bookmarks')//dev function for clearing cookies

init();
//clearBookmarks() 

export const uploadRecipe = async(newRecipe) => {
    try{
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ingr => {
                const [quantity, unit, description] = ingr[1].replaceAll(' ', '').split(',');

                if(ingr.length !== 3) throw new Error('Wrong ingredient format!') //Function will immediately exit when throwing error

                return { quantity: quantity ? +quantity : null, unit, description }
        })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients
        }

            sendJSON(`${API_URL}`)
    } catch(err){
        throw err
    }
}

