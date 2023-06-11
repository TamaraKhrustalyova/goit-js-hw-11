import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import {fetchQuery} from "./js/api.js";

const refs = {
    formEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
    inputEl: document.querySelector('input')
}

refs.formEl.addEventListener('submit', onQuerySubmit)

function onQuerySubmit(e){
    e.preventDefault()
    let searchedItem = refs.inputEl.value.trim();
    console.log(searchedItem)
        if(searchedItem === "") {
            Notiflix.Notify.warning('Please enter valid data to start the search.');
            return;
        }
        
    fetchQuery(searchedItem).then(({hits}) => {
        if(hits.length === 0) throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'))

            return hits.reduce((markup, imageCard) =>
            markup + createItemMarkup(imageCard), '')
        })
        .then((markup) => updateQueryList(markup))
        .catch(onError)
        .finally(() => refs.formEl.reset())
}

const lightbox = new SimpleLightbox('.gallery a', {captionsData: 'alt'});
lightbox.refresh();

function createItemMarkup({webformatURL, largeImageURL, tags, likes, views, comments, downloads}){
    return `
    <div class="image-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}"></a>
        <div class="card-info">
            <span><b>Likes</b> ${likes}</span>
            <span><b>Views</b> ${views}</span>
            <span><b>Comments</b> ${comments}</span>
            <span><b>Downloads</b> ${downloads}</span>
        </div>
    </div>
    `
}

function updateQueryList(markup){
    refs.galleryEl.innerHTML = markup
}

function onError(error){
    updateQueryList(`${error.message}`)
}

