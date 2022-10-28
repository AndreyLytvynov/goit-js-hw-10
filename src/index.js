import './css/styles.css';
import { fetchCountries } from './news-service/countries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const descriptionEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  descriptionEl.innerHTML = '';
  listEl.innerHTML = '';
  if (!e.target.value.trim()) {
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(arrCuntries => {
      if (arrCuntries.length > 10) {
        throw new Error(
          Notiflix.Notify.warning(
            `Too many matches found. Please enter a more specific name.`
          )
        );
      }
      const murk = markupCountries(arrCuntries);
      addMarkupOnPage(murk);
      return arrCuntries;
    })
    .then(arrCuntries => {
      if (arrCuntries.length !== 1) {
        throw new Error(error);
      }
      addMarkupOnPage2(markupCountry(arrCuntries));
    })
    .catch(err => {
      console.log(err);
    });
}

function markupCountries(arrCuntries) {
  return arrCuntries
    .map(({ name, flags: { svg } }) => {
      return `
    <li class='country'>
      <img src="${svg}" alt="" width="100">
      <p class="name-countries">${name}</p>
    </li>
    `;
    })
    .join('');
}

function markupCountry(arrCuntries) {
  return arrCuntries
    .map(({ capital, languages, population }) => {
      const leng = languages.map(el => {
        return el.name;
      });
      return `
<ul class="list-info">
  <li class="list"><span class="name">Capital</span> - ${capital}</li>
  <li class="list"><span class="name">Population</span> - ${population}</li>
  <li class="list"><span class="name">Languages</span> - ${leng.join(', ')}</li>
</ul>
  `;
    })
    .join('');
}

function addMarkupOnPage(markup) {
  listEl.innerHTML = markup;
}

function addMarkupOnPage2(markup) {
  descriptionEl.innerHTML = markup;
}

Notiflix.Notify.init({
  width: '380px',
  position: 'center-top',
  distance: '110px',
  timeout: 4000,
});
