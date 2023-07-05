const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  born: {
    type: Number
  },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'book' }]
})

module.exports = mongoose.model('Author', schema)