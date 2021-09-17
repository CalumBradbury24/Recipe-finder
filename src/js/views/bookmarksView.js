import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :).';//_ is Just a convention to specify that this variable should not be used outside of this class

    addHandlerRender(handler){
        window.addEventListener('load', handler);
    }

    _generateMarkup(){
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    }
}

export default new BookmarksView();//exporting the instance means there can only ever be one instance of this class created (singleton class)