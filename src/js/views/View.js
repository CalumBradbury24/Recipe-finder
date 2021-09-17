import icons from 'url:../../img/icons.svg';

export default class View { //Parent class of child views
    _data;

    render(data, render = true){
        if(!data || (Array.isArray(data) && !data.length)) return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup); //afterbegin = insert just inside the element, before its first child.
    }

    update(data){
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newMarkup);//Convert the html into a new DOM object (similar to a virtual dom)
        const newElements = Array.from(newDom.querySelectorAll('*')); //Select all elements in the new DOM and convert them into an array
        const currentElements = Array.from(this._parentElement.querySelectorAll('*')); //Get all elements in current DOM and convert them into an array

        // console.log(currentElements)
        // console.log(newElements)

        //Compare new DOM to current DOM
        newElements.forEach((newEl, i) => {
            const currentEl = currentElements[i];

            //If the element in new DOM is not equal to current DOM element and if the first child is text (any elements without text will be null)
            //Update changed text
            if(!newEl.isEqualNode(currentEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                currentEl.textContent = newEl.textContent;
            }

            //Update changed attributes
            if(!newEl.isEqualNode(currentEl)){
                Array.from(newEl.attributes).forEach(attr => currentEl.setAttribute(attr.name, attr.value)) //Update attributes on current DOM from new DOM
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){ //Takes a generic parent element and appends spinner to it
        const markup = ` 
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>`;
        this._parentElement.innerHTML = ''; //Clear element
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    renderError(message = this._errorMessage){
        const markup = `<div class="error">
                            <div>
                                <svg>
                                    <use href="${icons}#icon-alert-triangle"></use>
                                </svg>
                            </div>
                            <p>${message}</p>
                        </div>`
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup); //afterbegin = insert just inside the element, before its first child.
    }

    renderMessage(message = this._message){
        const markup = `<div class="recipe">
                            <div class="message">
                            <div>
                                <svg>
                                <use href="${icons}#icon-smile"></use>
                                </svg>
                            </div>
                            <p>${message}</p>
                        </div>`
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup); //afterbegin = insert just inside the element, before its first child.
    }

}