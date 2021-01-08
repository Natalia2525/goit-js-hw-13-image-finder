import './styles.css';
import * as toastr from 'toastr';
import './/../node_modules/toastr/build/toastr.css';
import newCard from './templates/card.hbs';
import ApiService from './js/apiService';
import debounce from 'lodash.debounce';
import LoadMoreBtn from './js/loanMoreBtn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const apiService = new ApiService();

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),
};

refs.searchForm.addEventListener('input', debounce(onSearch, 500));
loadMoreBtn.refs.button.addEventListener('click', fetchCards);

function renderCards(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', newCard(hits));
}

function onSearch(e) {
  apiService.query = refs.searchForm.elements.query.value;
  if (apiService.query === '') {
    loadMoreBtn.disable();
    loadMoreBtn.hide();
    clearMarkup();
    toastr.warning('Enter value for search');
    return;
  }

  loadMoreBtn.show();
  apiService.resetPage();
  clearMarkup();
  fetchCards();
}

function fetchCards() {
  loadMoreBtn.disable();
  apiService.fetchCards().then(hits => {
    renderCards(hits);
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.offsetHeight,
        behavior: 'smooth',
      });
    }, 2000);
    loadMoreBtn.enable();
  });
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}
