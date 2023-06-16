import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { throttle } from 'lodash';

import ImagesAPIService from "./js/api.js";

const imagesAPIService = new ImagesAPIService();
const lightbox = new SimpleLightbox('.gallery a', {captionsData: 'alt'});
const scroll = throttle(handleScroll, 500)

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    inputEl: document.querySelector('input'),
    loadMoreBtn: document.querySelector('.load-more'),
}

refs.form.addEventListener('submit', onQuerySubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onQuerySubmit(e){
    e.preventDefault()
    window.addEventListener("scroll", scroll);
    let searchedItem = refs.inputEl.value.trim();
   
        if(searchedItem === "") {
            clearImgList();
            Notiflix.Notify.warning('Please enter valid data to start the search.');
            return;
        }
        clearImgList();
        imagesAPIService.resetPage();
        imagesAPIService.setSearchValue(searchedItem);

        onLoadMore()
}     

async function onLoadMore(){
    try {
        const markup = await generateImageMarkup();
        if(markup === undefined) throw new Error;
        
       updateQueryList(markup); 

    } catch(err) {
        onError(err);
    }
}

async function generateImageMarkup(){
     try {
         const {hits, totalHits} = await imagesAPIService.fetchQuery();
         const lastPage = Math.ceil(totalHits / imagesAPIService.perPage);
         const newPage = imagesAPIService.page;

        if (totalHits > 0 && newPage === 2) {
            Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);     
        }
         
        if(newPage > lastPage && totalHits > 0) {
            Notiflix.Notify.warning(`'We're sorry, but you've reached the end of search results'`);
            window.removeEventListener("scroll", scroll);
        }
       
        if (hits.length === 0) 
            throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
        
        return hits.reduce((markup, imageCard) => markup + createItemMarkup(imageCard), '')

    } catch(err) {
        onError(err);
    }
}

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
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
}

function clearImgList(){
    refs.gallery.innerHTML = '';
}

function onError(){ 
    clearImgList()
}

function handleScroll() {
  const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }
}