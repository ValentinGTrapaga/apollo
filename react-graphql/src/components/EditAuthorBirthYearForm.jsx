import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BIRTH } from '../queries'

export const EditAuthorBirthYearForm = ({authors}) => {
  const [error, setError] = useState(null)

  const [ editBirth ] = useMutation(EDIT_BIRTH, {
    refetchQueries: [ALL_AUTHORS],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  const modifyYear = (e) => {
    e.preventDefault()
    const {name, year} = Object.fromEntries(new FormData(e.target))
    console.log({name, year})
    editBirth({variables: {name, birth: Number(year)}})
  }

  return (
    <>
    <legend>
      <h2>
        Modify an author year of birth
      </h2>
      <form onSubmit={modifyYear}>
        <label>
          Name: <select name='name' defaultValue={authors[0]}>
            {authors?.map(author  => (<option key={author}>{author}</option>))}
            </select>
        </label>
        <label>
          Born: <input type='number' name='year' />
        </label>
        <button>Modify</button>
      </form>
      </legend>
      {error && <p style={{color: 'red', fontWeight:600}}>{error}</p>}
    </>
  )
}
