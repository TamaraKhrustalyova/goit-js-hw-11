import axios from "axios";

const API_KEY = '37157085-2fd193525cfc932d78d0f680d'
const BASE_URL = `https://pixabay.com/api/`

export default class ImagesAPIService {
    constructor() {
        this.page = 1;
        this.searchValue = "";
    }

    async fetchQuery() {
        const url = `${BASE_URL}?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40&q=${this.searchValue}`
        // return fetch(url)
        // .then(res => res.json())
        // .then((data) => {
        //     
        //     return data;
        // });
        const res = await axios.get(url)
            this.incrementPage();
            return res.data;
        }

    setSearchValue(query) {
        this.searchValue = query;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }    
}



