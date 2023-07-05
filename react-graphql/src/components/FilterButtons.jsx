import React from 'react'

export const FilterButtons = ({booksArray, setFilter}) => {
  const genreFilters = []
  booksArray?.forEach((book) =>
    book.genres.forEach((genre) => {
      if(!genreFilters.includes(genre)) {
        genreFilters.push(genre)
    }})
  )
  return genreFilters.map(genre => {
    return(
      <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      )
  })
}
