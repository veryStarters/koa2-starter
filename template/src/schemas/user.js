import mongoose from 'mongoose'

export default new mongoose.Schema({
  id: Number,
  name: String,
  age: Number,
  gender: {
    type: String,
    default: '男'
  }
})
