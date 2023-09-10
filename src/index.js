import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPictures, page, query } from './js/api-pixabay';
import { createMarkup } from './js/create-markup';

const links = {
  formLink: document.querySelector('#search-form'),
  galleryLink: document.querySelector('.gallery'),
  loadLink: document.querySelector('.btn-load--invisible'),
};

links.formLink.addEventListener('submit', onSubmit);
links.loadLink.addEventListener('click', onLoadClick);

const lightbox = new SimpleLightbox('.gallery a');

async function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();
  if (!searchQuery) {
    Notify.failure('Enter a search query!');
    return;
  }
  try {
    const searchData = await getPictures(searchQuery);
    const { hits, totalHits } = searchData;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images!`);
    const markup = hits.map(item => createMarkup(item)).join('');
    links.galleryLink.innerHTML = markup;
    if (totalHits > 40) {
      links.loadLink.classList.remove('btn-load--invisible');
      page += 1;
    }
    lightbox.refresh();
  } catch (error) {
    Notify.failure('Something went wrong! Please retry');
    console.log(error);
  }
}

async function onLoadClick() {
  const response = await getPictures(query);
  const { hits, totalHits } = response;
  const markup = hits.map(item => createMarkup(item)).join('');
  links.galleryLink.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  const amountOfPages = totalHits / 40 - page;
  if (amountOfPages < 1) {
    links.loadLink.classList.add('btn-load--invisible');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
