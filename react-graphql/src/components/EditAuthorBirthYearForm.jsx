import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BIRTH } from '../queries'

export const EditAuthorBirthYearForm = ({authors}) => {
  
  const [name, setName] = useState('')
  const [born, setBorn] = useState('') 
  const [error, setError] = useState(null)

  const [ editBirth ] = useMutation(EDIT_BIRTH, {
    refetchQueries: [ALL_AUTHORS],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })


  const modifyYear = (e) => {
    e.preventDefault()
    console.log({name, born})
    editBirth({variables: {name, birth: Number(born)}})
  }

  return (
    <>
    <legend>
        Modify an author year of birth
      <form onSubmit={modifyYear}>
        <label>
          Name: <select value={name} onChange={(e) => setName(e.target.value)}>
            {authors.map(author  => (<option key={author}>{author}</option>))}
            </select>
        </label>
        <label>
          Born: <input type='number' onChange={(e) => setBorn(e.target.value)}/>
        </label>
        <button>Modify</button>
      </form>
      </legend>
      {error && <p style={{color: 'red', fontWeight:600}}>{error}</p>}
    </>
  )
}
