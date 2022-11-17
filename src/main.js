const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY 
  }
})

function createMovies(data, container) {
  container.innerHTML = ""

  const { results } = data

  results.forEach(item => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')
    
    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', item.title) 
    movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${item.poster_path}`) 
    movieImg.addEventListener('click', () => {
      location.hash = 'movie=' + item.id
    })

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

async function getTrendingMoviesPreview() {
  const {data} = await api('trending/movie/day')
  createMovies(data, trendingMoviesPreviewList)
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

  createMovies(data, relatedMoviesContainer)

}