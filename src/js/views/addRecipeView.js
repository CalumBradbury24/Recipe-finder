import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super() //allows using this
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow(){
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //Makes this refer to this^ object and not the button this handler is attached to
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); //Makes this refer to this^ object and not the button this handler is attached to
        this._overlay.addEventListener('click', this.toggleWindow.bind(this)); //Makes this refer to this^ object and not the button this handler is attached to
    }

    addHandlerUpload(handler){
        this._parentElement.addEventListener('submit', (e) => {
            e.preventDefault()
            const dataArr = [...new FormData(this)] //Array containing all fields from form
            const data = Object.fromEntries(dataArr) //Converts a list of key-value pairs into an object
            handler(data);
        })
    }

    _generateMarkup(){

    }

}


export default new AddRecipeView();