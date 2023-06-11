import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import ImagesAPIService from "./js/api.js";

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    inputEl: document.querySelector('input'),
    loadMoreBtn: document.querySelector('.load-more'),
}

const imagesAPIService = new ImagesAPIService();

refs.form.addEventListener('submit', onQuerySubmit);
refs.loadMoreBtn.addEventListener('submit', onQuerySubmit);

function onQuerySubmit(e){
    e.preventDefault()
    let searchedItem = refs.inputEl.value.trim();
    // console.log(searchedItem)
        if(searchedItem === "") {

            updateQueryList('');
            Notiflix.Notify.warning('Please enter valid data to start the search.');
            refs.loadMoreBtn.classList.add('is-hidden');
            return;
        }
        
        imagesAPIService.setSearchValue(searchedItem);

        imagesAPIService.fetchQuery()
        .then(({hits, totalHits}) => {

        if(hits.length === 0) throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'))
            
            Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`)
            return hits.reduce((markup, imageCard) =>
            markup + createItemMarkup(imageCard), '')
        })
        .then((markup) => updateQueryList(markup))
        .catch(onError)
        .finally(() => refs.form.reset())
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
    refs.gallery.innerHTML = markup
    refs.loadMoreBtn.classList.remove('is-hidden')
}

function onError(error){
    updateQueryList(`${error.message}`)
    refs.loadMoreBtn.classList.add('is-hidden')
}
