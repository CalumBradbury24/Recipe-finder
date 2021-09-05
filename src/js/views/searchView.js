class SearchView {
    #parentEl = document.querySelector('.search');

    getQuery(){
        const query = this.#parentEl.querySelector('.search__field').value; //Get text in search field
        this.#clearInput();
        return query;
    }

    #clearInput(){
        this.#parentEl.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler){
        this.#parentEl.addEventListener('submit', (e) => { //Submit listens for the user pressing the button or hitting enter after entering text into search field
            e.preventDefault();
            handler(); //Call the controlSearchResults function that is passed in
        })
    }
}

export default new SearchView
