import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2
//Presentation logic in views
//Application logic in controller

//Controller calls api methods etc on model

// automatically update modules in the browser at runtime without needing a whole page refresh
if(module.hot) module.hot.accept(); //Parcel

//Controls recipes being rendered on screen
const controlRecipes = async() => {
    try{
        const id = window.location.hash.slice(1); //get hash from current url (removing '#' from start)
        if(!id) return;

        //0) update results view to mark selected search result with css
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);
        
        //1 Loading recipe
        recipeView.renderSpinner();
        await model.loadRecipe(id);

        //2 Rendering recipe
        recipeView.render(model.state.recipe)

    } catch(err){
        console.log(err)
        recipeView.renderError()
        alert(err) //Catches the error thrown in the try block
    }
}

//controls the search results in the search results bar
const controlSearchResults = async() => {
    try{
        resultsView.renderSpinner();
        //Get search value entered by user
        const query = searchView.getQuery();
        if(!query) return;

        //Get results
        await model.loadSearchResults(query); //Loads results into state (which is imported into here from model.js)

        //render results
        console.log(model.state.search.results)
        resultsView.render(model.getSearchResultsPage());

        //render initial pagination buttons
        paginationView.render(model.state.search);
    } catch(err){
        console.log(err)
        alert(err) //Catches the error thrown in the try block
    }
}

const controlPagination = (goToPage) => {
    // render new results
    resultsView.render(model.getSearchResultsPage(goToPage));

    //render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = (numOfNewServings) => {
    //Update number of recipe servings in state
    model.updateServings(numOfNewServings)
    //Update recipe on screen
    recipeView.update(model.state.recipe)
}

const controlAddBookmark = () => {
    //add/remove bookmark
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
    else model.deleteBookmark(model.state.recipe.recipeID);

    //update recipe view
    recipeView.update(model.state.recipe)

    //render bookmarks
    bookmarksView.render(model.state.bookmarks) //model.state.bookmarks is an array of bookmarked recipes
}

const controlBookmarks = () => {
    bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async(newRecipe) => {
    try{
        await model.uploadRecipe(newRecipe)
    } catch(err){
        addRecipeView.renderError(err.message)
    }
}

//Publisher-Subscriber pattern
const init = () => { //Add required event listeners
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();