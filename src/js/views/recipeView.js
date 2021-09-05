import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional'; //Used for generating fraction numbers
import View from './View.js';

class RecipeView extends View { //Not exported here to fulfill singleton Design Pattern so that multiple RecipeView classes cant be made
    _parentElement = document.querySelector(".recipe"); //Private field that cannot be accessed outside of this class (stops someone using this value elsewhere when creating an instance of this class)
    _errorMessage = 'We could not find that recipe. Please try another!';
    _message = ''; //Just a convention to specify that this variable should not be used outside of this class

    //Publisher
    addHandlerRender(subscriberFunction){
        //Add event listener to get new recipe if the page hash changes and initially on page load
        ['hashchange', 'load'].forEach(e => window.addEventListener(e, subscriberFunction));
    }

    addHandlerUpdateServings(subscriberFunction){
        this._parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--update-servings');
            if(!btn) return;
            const updateTo = +btn.dataset.updateTo; //'-' in attribute names are converted to camelCase
            if(updateTo > 0) subscriberFunction(updateTo); //Dont call handler if less than 1 servings are selected
        })
    }

    addHandlerAddBookmark(subscriberFunction){
        this._parentElement.addEventListener('click', (e) => { //Listen to the event on the parent element since the child element may not exist at this time
            const btn = e.target.closest('.btn--bookmark'); //Get closest element that was clicked on
            if(!btn) return;
            subscriberFunction();
        })
    }

    _generateMarkup(){
        return `<figure class="recipe__fig">
            <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
            <h1 class="recipe__title">
                <span>${this._data.title}</span>
            </h1>
            </figure>

            <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
                    <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
                    <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                </button>
                </div>
            </div>

            <div class="recipe__user-generated">
            </div>
            <button class="btn--round btn--bookmark">
                <svg class="">
                <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
                </svg>
            </button>
            </div>

            <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">

            ${this._data.ingredients.map(this._generateIngredientMarkup).join('')}

            </ul>
            </div>

            <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
                directions at their website.
            </p>
            <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
            >
                <span>Directions</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </a>
            </div>`;
    }

    _generateIngredientMarkup(ingredient){
        return `<li class="recipe__ingredient">
                    <svg class="recipe__icon">
                        <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${ingredient.quantity ?  new Fraction(ingredient.quantity).toString() : ''}</div>
                    <div class="recipe__description">
                        <span class="recipe__unit">${ingredient.unit}</span>
                        ${ingredient.description}
                    </div>
                </li>`
    }
}

export default new RecipeView(); 