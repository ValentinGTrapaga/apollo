const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/userLibrary')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const { GraphQLError } = require('graphql')
const author = require('./models/author')

require('dotenv').config()

const pubsub = new PubSub()

const resolvers = {
  Query: {
    resetDB: async (root, args, context) => {
      await Author.deleteMany({})
      await Book.deleteMany({})

      return true
    },
    me: (root, args, context) => context.currentUser,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }
      if (args.author && !args.genre) {
        return Book.find({ author: { name: args.name } }).populate('author')
      } else if (!args.author && args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      } else {
        return Book.find({
          genres: { $in: [args.genre] },
          author: { name: args.name }
        }).populate('author')
      }
    },
    allAuthors: async () => {
      return Author.find({})
    }
  },
  Author: {
    bookCount: async (root) => {
      const foundBooks = await Book.find({ author: root.id })
      return foundBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      try {
        let bookArgs = {
          title: args.title,
          published: args.published,
          genres: args.genres,
        }
        const foundAuthor = await Author.findOne({ name: args.author })
        if (!foundAuthor) {
          const author = new Author({ name: args.author, born: null })
          await author.save()
          bookArgs.author = author.id
        } else {
          bookArgs.author = foundAuthor.id
        }
        const book = new Book(bookArgs)
        await book.save()
        bookAdded = book.populate('author')

        pubsub.publish('BOOK_ADDED', { bookAdded })

        return bookAdded
      } catch (error) {
        throw new GraphQLError('There was an error adding the book', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      try {
        const foundAuthor = await Author.findOne({ name: args.name })
        if (foundAuthor) {
          foundAuthor.born = args.setBornTo
          const updatedAuthor = await foundAuthor.save()
          return updatedAuthor
        }
      } catch (error) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        return user.save()
      } catch (error) {
        console.log(error)
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      console.log('Aca llego')
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
