const API_KEY = '37157085-2fd193525cfc932d78d0f680d'
const BASE_URL = `https://pixabay.com/api/`

function fetchQuery(query){
    const url = `${BASE_URL}?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${query}`
    return fetch(url)
    .then(res => res.json())
}

export {fetchQuery};

