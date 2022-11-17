const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY 
  }
})

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    const url = entry.target.getAttribute('data-img')
    if(entry.isIntersecting){
      entry.target.setAttribute('src', url)
      lazyLoader.unobserve(entry.target)
    }
  })
})

function createMovies(data, container, lazyLoad = false) {

  container.innerHTML = ""

  const { results } = data

  results.forEach(item => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')
    
    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', item.title) 
    // movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', `https://image.tmdb.org/t/p/w300${item.poster_path}`) 
    movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${item.poster_path}`) 
    movieImg.setAttribute('loading', 'lazy') 
    movieImg.addEventListener('click', () => {
      location.hash = 'movie=' + item.id
    })

    // if(lazyLoad){
    //   lazyLoader.observe(movieImg)
    // }

    movieContainer.appendChild(movieImg)
    container.appendChild(movieContainer)
  })
}

function createCategories(categories, container) {
  container.innerHTML = ""
  
  categories.forEach(category => {
    const categoryContainer = document.createElement('div')
    categoryContainer.classList.add('category-container')
    
    const categoryTitle = document.createElement('h3')
    categoryTitle.classList.add('category-title')
    categoryTitle.setAttribute('id', 'id' + category.id) 
    const categoryTitleText = document.createTextNode(category.name)
    categoryTitle.addEventListener('click', ()=>{
      location.hash = `category=${category.id}-${category.name}`
    })

    categoryTitle.appendChild(categoryTitleText)
    categoryContainer.appendChild(categoryTitle)
    container.appendChild(categoryContainer)

  });
}


// Function Pages

async function getTrendingMoviesPreview() {
  const {data} = await api('trending/movie/day')
  createMovies(data, trendingMoviesPreviewList, true)
}

async function getCategoriesPreview() {
  const {data} = await api('genre/movie/list')
  const categories = data.genres
  createCategories(categories ,categoriesPreviewList)
}

async function getMoviesByCategory(id) {
  const {data} = await api('discover/movie', {
    params: {
      with_genres: id
    }
  })
  createMovies(data, genericSection)
}

async function getMoviesBySearch(query) {
  const {data} = await api('search/movie', {
    params: {
      query
    }
  })
  createMovies(data, genericSection)
}

async function getTrendingMovies() {
  const {data} = await api('trending/movie/day')
  createMovies(data, genericSection)
}

async function getMovieById(id) {
  const {data: movie} = await api('movie/' + id)

  const url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  headerSection.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${url})
  `

  movieDetailTitle.textContent = movie.title
  movieDetailDescription.textContent = movie.overview
  movieDetailScore.textContent = movie.vote_average

  createCategories(movie.genres, movieDetailCategoriesList)

  getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id) {
  const { data } = await api('movie/' + id + '/recommendations')

  createMovies(data, relatedMoviesContainer, true)

}