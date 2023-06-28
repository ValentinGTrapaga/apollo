import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author
    published
    id
  }
}`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    bookCount
    born
  }
}`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    author
    published
  }
}`

export const EDIT_BIRTH = gql`
mutation editBirth($name: String!, $birth: Int!) {
  editAuthor(name: $name, setBornTo: $birth) {
    name
    born
  }
}
`