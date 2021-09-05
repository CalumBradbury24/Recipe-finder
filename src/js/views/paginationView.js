import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--inline'); //Searches up the tree (looks for closest parent)

            if(!btn) return;

            const goToPage = +btn.dataset.goto; //Custom data set on button elements to get page number
            handler(goToPage);
        })
    }

    _generateMarkup(){
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); //Number of results / 10 to get how many pages there are
        const currentPage = this._data.page;
        // on first page and there are other pages
        if(currentPage === 1 && numPages > 1){
            return `<button data-goto="${currentPage + 1}"  class="btn--inline pagination__btn--next">
                        <span>Page ${currentPage + 1}</span>
                        <svg class="search__icon">
                            <use href="${icons}#icon-arrow-right"></use>
                        </svg>
                    </button>`
        }

        //On last page
        if(currentPage === numPages && numPages > 1){
            return `<button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                            <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span>Page ${currentPage - 1}</span>
                    </button>`
        }

        //on a page with others still to come
        if(currentPage < numPages){
            return `<button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                        <svg class="search__icon">
                            <use href="${icons}#icon-arrow-left"></use>
                        </svg>
                        <span>Page 1</span>
                    </button>
                    <button data-goto="${currentPage + 1}"  class="btn--inline pagination__btn--next">
                        <span>Page ${currentPage + 1}</span>
                        <svg class="search__icon">
                            <use href="${icons}#icon-arrow-right"></use>
                        </svg>
                    </button>`
        }

        //else on page 1 and there are no other pages
        return;
    }

}


export default new PaginationView();