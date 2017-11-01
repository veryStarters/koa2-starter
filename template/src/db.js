import mongoose from 'mongoose'
import config from './config'
const db = mongoose.connect(config.db, {}, function (err) {
  if (err) {
    process.exit()
  }
})
export default db