const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY 
  }
})

function mapList(arr, container) {
  arr.forEach(item => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')
    
    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', item.title) 
    movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${item.poster_path}`) 

    movieContainer.appendChild(movieImg)
    container.appendChild(movieContainer)
  })
}

async function getTrendingMoviesPreview() {
  const {data} = await api('trending/movie/day')

  trendingMoviesPreviewList.innerHTML = ""

  const movies = data.results
  console.log(movies)
  mapList(movies, trendingMoviesPreviewList)

}

async function getCategoriesPreview() {
  const {data} = await api('genre/movie/list')

  categoriesPreviewList.innerHTML = ""

  const categories = data.genres
  
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
    categoriesPreviewList.appendChild(categoryContainer)

  });
}

async function getMoviesByCategory(id) {
  const {data} = await api('discover/movie', {
    params: {
      with_genres: id
    }
  })

  genericSection.innerHTML = ""

  const movies = data.results
  console.log(movies)
  mapList(movies, genericSection)

}
