// Data

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY 
  }
})

function likedMoviesList() {
  const item = localStorage.getItem('liked_movies')
  let movies = JSON.parse(item)
  return movies
}

function likeMovie(movie) {
  const likedMovies = likedMoviesList()
  
  if(likedMovies[movie.id]){
    likedMovies[movie.id] = undefined
  }else {
    likedMovies[movie.id] = movie
  }

  localStorage.setItem('liked_movies' ,JSON.stringify(likedMovies))
}

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

function createMovies(data, container, {lazyLoad = false, clean = true} = {}, storage = false) {
  if(clean) {
    container.innerHTML = ""
  }

  let results

  if(storage){
    results = Object.values(data)
  }else{
    results = data.results
  }

  const arr = results

  arr.forEach(item => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')
    
    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', item.title) 
    // movieImg.setAttribute(lazyLoad ? 'data-img' : 'src', `https://image.tmdb.org/t/p/w300${item.poster_path}`) 
    movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${item.poster_path}`) 
    movieImg.setAttribute('loading', 'lazy') 
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute('src', 'https://cdn-icons-png.flaticon.com/512/2748/2748558.png')
    })
    movieImg.addEventListener('click', () => {
      location.hash = 'movie=' + item.id
    })

    const movieBtn = document.createElement('button')
    movieBtn.classList.add('movie-btn')
    likedMoviesList()[item.id] && movieBtn.classList.add('movie-btn--liked')
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked')
      likeMovie(item)
      getLikedMovies()
      getTrendingMoviesPreview()
      checkLikedList()
    })

    movieContainer.appendChild(movieBtn)
    movieContainer.appendChild(movieImg)
    container.appendChild(movieContainer)
  })
}

function checkLikedList () {
  const likedList = Object.values(likedMoviesList())  
  console.log(likedList.length)
  if(likedList.length == 0){
    likedMoviesContainer.classList.add('liked-movieList--empty')
    likedMoviesContainer.innerText = 'Aun no tienes pelis favs'
  }
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
// Previews
async function getTrendingMoviesPreview() {
  const {data} = await api('trending/movie/day')
  createMovies(data, trendingMoviesPreviewList, {lazyLoad: true})
}

async function getCategoriesPreview() {
  const {data} = await api('genre/movie/list')
  const categories = data.genres
  createCategories(categories ,categoriesPreviewList)
}

// Category

async function getMoviesByCategory(id) {
  const {data} = await api('discover/movie', {
    params: {
      with_genres: id
    }
  })
  maxPage = data.total_pages
  createMovies(data, genericSection, {lazyLoad: true})
}

function getPaginatedMoviesByCategory(id) {
  return async function() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    if(scrollIsBottom && pageIsNotMax) {
      page ++
      const {data} = await api('discover/movie', {
        params: {
          query,
          page
        }
      })
    createMovies(data, genericSection, { lazyLoad: true, clean: false })
    }
  } 
}

// Search

async function getMoviesBySearch(query) {
  searchFormInput.value = ''
  const {data} = await api('search/movie', {
    params: {
      query
    }
  })
  maxPage = data.total_pages
  console.log(maxPage)
  createMovies(data, genericSection)
}

function getPaginatedMoviesBySearch(query) {
  return async function() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage

    // query = this.query

    if(scrollIsBottom && pageIsNotMax) {
      page ++
      const {data} = await api('search/movie', {
        params: {
          query,
          page
        }
      })
    createMovies(data, genericSection, { lazyLoad: true, clean: false })
    }
  } 
}

// Trending

async function getTrendingMovies() {
  const {data} = await api('trending/movie/day')
  createMovies(data, genericSection)
  maxPage = data.total_pages

  // const btnLoadMore = document.createElement('button')
  // btnLoadMore.innerText = 'Cargar mas'
  // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies)
  // genericSection.appendChild(btnLoadMore)

}

async function getPaginatedTrendingMovies () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
  const pageIsNotMax = page < maxPage

  if(scrollIsBottom && pageIsNotMax) {
    page ++
  const {data} = await api('trending/movie/day', {
    params: {
      page
    }
  })
  createMovies(data, genericSection, { lazyLoad: true, clean: false })
  }
}

// Details 

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

// Liked

function getLikedMovies () {
  const likedMovies = likedMoviesList()
  if(likedMovies){
    createMovies(likedMovies, likedMoviesContainer, { clear: true }, true)
  }else{
    return false
  }

}