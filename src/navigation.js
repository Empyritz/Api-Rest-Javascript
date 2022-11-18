let maxPage;
let page = 1
let infiniteScroll

searchFormBtn.addEventListener('click', () => {
  location.hash = 'search=' + searchFormInput.value
})
trendingBtn.addEventListener('click', () => {
  location.hash = 'trends'
})
arrowBtn.addEventListener('click', () => {
  history.back()
  // location.hash = 'home'
})

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
page = 1

  console.log({ location })

  if(infiniteScroll){
    window.removeEventListener('scroll', infiniteScroll, {passive: false})
    infiniteScroll = undefined
  }

  if(location.hash.startsWith('#trends')){
    trendsPage()
  }else if(location.hash.startsWith('#search=')){
    searchPage()
  }else if(location.hash.startsWith('#movie=')){
    movieDetailsPage()
  }else if(location.hash.startsWith('#category=')){
    categoriesPage()
  }else {
    homePage()
  }

  // document.body.scrollTop = 0
  document.documentElement.scrollTop = 0

  if(infiniteScroll) {
    window.addEventListener('scroll', infiniteScroll, {passive: false})
  }
}

function homePage() {

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''

  arrowBtn.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  genericSection.classList.add('inactive')
  movieDetailSection.classList.add('inactive')

  arrowBtn.classList.remove('header-arrow--white')

  trendingPreviewSection.classList.remove('inactive')
  categoriesPreviewSection.classList.remove('inactive')
  headerTitle.classList.remove('inactive')
  searchForm.classList.remove('inactive')
  likedSection.classList.remove('inactive')
  
  getTrendingMoviesPreview()
  getCategoriesPreview()
  getLikedMovies()
  checkLikedList()
}

function categoriesPage() {

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  
  arrowBtn.classList.remove('inactive')
  headerCategoryTitle.classList.remove('inactive')
  genericSection.classList.remove('inactive')
  
  arrowBtn.classList.remove('header-arrow--white')

  likedSection.classList.add('inactive')
  movieDetailSection.classList.add('inactive')
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  headerTitle.classList.add('inactive')
  searchForm.classList.add('inactive')

  
  const [_, categoryData] = location.hash.split('=')
  const [categoryId, categoryName] = categoryData.split('-')

  headerCategoryTitle.innerText = categoryName
  getMoviesByCategory(categoryId)

  infiniteScroll = getPaginatedMoviesBySearch(id)

}

function movieDetailsPage() {
  
  headerSection.classList.add('header-container--long')
  // headerSection.style.background = ''
  
  arrowBtn.classList.remove('inactive')
  movieDetailSection.classList.remove('inactive')
  
  likedSection.classList.add('inactive')
  arrowBtn.classList.add('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.add('inactive')
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  genericSection.classList.add('inactive')

  const [_, id] = location.hash.split('=')
  getMovieById(id)

}

function searchPage() {
  
  const [_, query] = location.hash.split('=')
  getMoviesBySearch(query)

  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  
  arrowBtn.classList.remove('inactive')
  genericSection.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  
  likedSection.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  movieDetailSection.classList.add('inactive')
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  headerTitle.classList.add('inactive')
  searchForm.classList.remove('inactive')

  // getPaginatedMoviesBySearch.query = query
  // getPaginatedMoviesBySearch = getPaginatedMoviesBySearch.bind(getPaginatedMoviesBySearch)
  infiniteScroll = getPaginatedMoviesBySearch(query)

}

function trendsPage() {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  
  arrowBtn.classList.remove('inactive')
  headerCategoryTitle.classList.remove('inactive')
  genericSection.classList.remove('inactive')
  
  arrowBtn.classList.remove('header-arrow--white')

  movieDetailSection.classList.add('inactive')
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  headerTitle.classList.add('inactive')
  searchForm.classList.add('inactive')
  likedSection.classList.add('inactive')

  headerCategoryTitle.innerText = 'Trends'
  
  getTrendingMovies()

  infiniteScroll = getPaginatedTrendingMovies
}