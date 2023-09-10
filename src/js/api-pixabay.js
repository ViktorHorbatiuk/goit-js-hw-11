import axios from 'axios';
export let page = 1;
export let query = null;

const HOME_URL = 'https://pixabay.com/api/';
const KEY = '39347576-67819d050db02820e5426c8a4';
const params = `?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

export async function getPictures(searchQuery) {
  if (searchQuery !== query) {
    page = 1;
    query = searchQuery;
  }
    try {
    const response = await axios.get(
      `${HOME_URL}${params}&q=${query}&page=${page}`
    );
    page += 1;
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong! Please retry');
    console.log(error);
  }
}
