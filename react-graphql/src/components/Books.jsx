import { useEffect, useState } from 'react'
import { FilterButtons } from './FilterButtons'

const Books = ({ booksArray, refetch }) => {
  const [filter, setFilter] = useState('')

  const booksToShow =
    filter === ''
      ? booksArray
      : booksArray.filter((book) => book.genres.includes(filter))

  useEffect(() => {
    refetch({genre: filter})
  }, [filter])

  return (
    <div>
      <h2>books</h2>
      <FilterButtons
        booksArray={booksArray}
        setFilter={setFilter}
      />
      <button onClick={() => setFilter('')}>Reset filter</button>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow?.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default Books
