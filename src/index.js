import Notiflix from 'notiflix';
import axios from 'axios';
import {fetchQuery} from "./js/api.js";

const refs = {
    formEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
    inputEl: document.querySelector('input')
}

refs.formEl.addEventListener('submit', onQuerySubmit)

function onQuerySubmit(e){
    e.preventDefault()
    let searchedItem = refs.inputEl.value;
    fetchQuery(searchedItem).then(({hits}) => {
            return hits.reduce((markup, imageCard) =>
            markup + createItemMarkup(imageCard), '')
        })
        .then((markup) => refs.galleryEl.innerHTML = markup)
        .catch(onError)
        .finally(() => refs.formEl.reset())
}

function createItemMarkup({webformatURL, largeImageURL, tags, likes, views, comments, downloads}){
    return `
    <div class="image-card">
        <img src="${webformatURL}" alt="${tags}">
        <span><b>Likes</b> ${likes}</span>
        <span><b>Views</b> ${views}</span>
        <span><b>Comments</b> ${comments}</span>
        <span><b>Downloads</b> ${downloads}</span>
    </div>
    `
}

function onError(){
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

