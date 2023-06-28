import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTH } from '../queries'
import { useState } from 'react'
import { EditAuthorBirthYearForm } from './EditAuthorBirthYearForm'

const Authors = (props) => {
  if (!props.show) {
    return null
  }

  const result = useQuery(ALL_AUTHORS)

  console.log(result)

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
            <tr key={a.name}>
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
