import View from './View.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again.';//_ is Just a convention to specify that this variable should not be used outside of this class

    _generateMarkup(){
        const id = window.location.hash.slice(1);//Get everything from the hash except the first element

        return this._data.map((result) =>
            `<li class="preview">
                <a class="preview__link ${+result.id === +id ? 'preview__link--active' : ''}" href="#${result.recipeID}">
                    <figure class="preview__fig">
                        <img src="${result.image}" alt="${result.title}" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${result.title}</h4>
                        <p class="preview__publisher">${result.publisher}</p>
                    </div>
                </a>
            </li>`
        ).join('')
    }
}

export default new ResultsView();//exporting the instance means there can only ever be one instance of this class created (singleton class)