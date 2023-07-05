import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { LoginForm } from './components/LoginForm'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED, GET_CURRENT_USER } from './queries';
import { Recommended } from './components/Recommended'

const App = () => {
  const [notification, setNotification] = useState('')
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const { data, loading, refetch } = useQuery(ALL_BOOKS)
  const meResult = useQuery(GET_CURRENT_USER)

  useSubscription(BOOK_ADDED, {
    onData: ({data}) => {
      const {bookAdded} = data.data
      alert(`${data.data.bookAdded.title} has been added`)
      client.cache.updateQuery({query: ALL_BOOKS}, ({allBooks}) => {
        return {
          allBooks: allBooks.concat(bookAdded)
        }
      })
    }
  })

  useEffect(() => {
    const userToken = localStorage.getItem('library-user-token')
    if(userToken) {
      setToken(userToken)
      meResult.refetch()
    }
  }, [])

  const logout = () => {
    setPage('authors')
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  if(loading || meResult.loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      {notification && <h3>{notification}</h3>}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token ? (
          <>
            <LoginForm setToken={setToken} />
          </>
        ) : (
          <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommended')}>recommended books</button>
          <button onClick={logout}>Log out</button>
          </>
        )}
      </div>

      {page === 'authors' && <Authors show={page === 'authors'} />}

      {page === 'books' && <Books show={page === 'books'} booksArray={data.allBooks} refetch={refetch} />}

      {page === 'add' && <NewBook show={page === 'add'} />}

      {page === 'recommended' && <Recommended booksArray={data.allBooks} user={meResult.data.me} />}
    </div>
  )
}

export default App
