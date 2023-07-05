export const Recommended = ({booksArray, user}) => {

  console.log(user)
  const {favoriteGenre, username} = user

  const recommendedBooks = booksArray.filter(book => book.genres.includes(favoriteGenre))

  return (
    <div>
      <h1>Recommended books for {username}, category: {favoriteGenre}</h1>
    <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks?.map((a) => (
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
