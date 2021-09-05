import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { result } from 'lodash';

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
        resultsView.update(model.getSearchResultsPage())

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
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
    else model.deleteBookmark(model.state.recipe);
    recipeView.update(model.state.recipe)
}

//Publisher-Subscriber pattern
const init = () => { //Add required event listeners
    recipeView.addHandlerRender(controlRecipes);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
}

init();