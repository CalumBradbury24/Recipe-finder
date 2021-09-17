import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again.';//_ is Just a convention to specify that this variable should not be used outside of this class

    _generateMarkup(){
        const id = window.location.hash.slice(1);//Get everything from the hash except the first element
        return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsView();//exporting the instance means there can only ever be one instance of this class created (singleton class)