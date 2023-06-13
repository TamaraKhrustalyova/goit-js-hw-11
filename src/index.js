import Notiflix from 'notiflix';
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
refs.loadMoreBtn.addEventListener('click', fetchImgs);

async function fetchImgs(){
    try {
        const markup = await generateImageMarkup();
        if(markup === undefined) throw new Error;
        
        updateQueryList(markup); 
        
    } catch(err) {
        onError(err);
    }

    // return generateImageMarkup()
    // .then((markup) => updateQueryList(markup))
}

function onQuerySubmit(e){
    e.preventDefault()
    let searchedItem = refs.inputEl.value.trim();
    
        if(searchedItem === "") {

            clearImgList();
            Notiflix.Notify.warning('Please enter valid data to start the search.');
            refs.loadMoreBtn.classList.add('is-hidden');

            return;
        }
        
        clearImgList();
        imagesAPIService.resetPage();
        imagesAPIService.setSearchValue(searchedItem);

        fetchImgs()
        .catch(onError)
        .finally(() => refs.form.reset())
}       

async function generateImageMarkup(){

    const {hits, totalHits} = await imagesAPIService.fetchQuery();
        try {
            if (hits.length === 0) 
                throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
                
                Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`)
                return hits.reduce((markup, imageCard) =>
                markup + createItemMarkup(imageCard), '')

        } catch(err) {
            onError(err);
        }
                

    // return imagesAPIService.fetchQuery()
    // .then(({hits, totalHits}) => {

    //     if (hits.length === 0) 
    //         throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'));
        
    //     Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`)
    //     return hits.reduce((markup, imageCard) =>
    //     markup + createItemMarkup(imageCard), '')        
    // })
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
    refs.gallery.insertAdjacentHTML('beforeend', markup)
    refs.loadMoreBtn.classList.remove('is-hidden')
}

function clearImgList(){
    refs.gallery.innerHTML = '';
}

function onError(error){
    updateQueryList(`${error.message}`)
    refs.loadMoreBtn.classList.add('is-hidden')
}
