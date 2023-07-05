import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import { useState } from 'react'
import { EditAuthorBirthYearForm } from './EditAuthorBirthYearForm'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <h1>Loading the data...</h1>
  }

  const authorOptions = result.data.allAuthors.map(a => a.name)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthorBirthYearForm authors={authorOptions} />
    </div>
  )
}

export default Authors
