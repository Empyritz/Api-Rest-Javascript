searchFormBtn.addEventListener('click', () => {
  location.hash = 'search='
})
trendingBtn.addEventListener('click', () => {
  location.hash = 'trends'
})
arrowBtn.addEventListener('click', () => {
  location.hash = 'home'
})

window.addEventListener('DOMContentLoaded', navigator, false)
window.addEventListener('hashchange', navigator, false)

function navigator() {
  console.log({ location })

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
  
  getTrendingMoviesPreview()
  getCategoriesPreview()
}

function categoriesPage() {

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

  
  const [_, categoryData] = location.hash.split('=')
  const [categoryId, categoryName] = categoryData.split('-')

  headerCategoryTitle.innerText = categoryName
  getMoviesByCategory(categoryId)

}

function movieDetailsPage() {
  
  headerSection.classList.add('header-container--long')
  // headerSection.style.background = ''
  
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.add('header-arrow--white')
  movieDetailSection.classList.remove('inactive')

  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.add('inactive')
  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  genericSection.classList.add('inactive')

}

function searchPage() {
  
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
  searchForm.classList.remove('inactive')

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
}