import { useMutation } from '@apollo/client'
import { GET_CURRENT_USER, LOGIN } from '../queries'
import { useEffect } from 'react'

export const LoginForm = ({setToken}) => {
  const [login, { data, loading }] = useMutation(LOGIN, {
    onError: (error) => console.log(error)  })

  useEffect(() => {
    if(data) {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [data])

  const onSubmit = async (e) => {
    e.preventDefault()
    const { username, password } = Object.fromEntries(new FormData(e.target))
    const loginData = login({ variables: { username, password } })
  }

  if (loading) return <h2>Loading...</h2>

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>
          username:
          <input
            name='username'
            type='text'
          />
        </label>
        <label>
          password:
          <input
            name='password'
            type='password'
          />
        </label>
        <button>Log in</button>
      </form>
    </div>
  )
}
