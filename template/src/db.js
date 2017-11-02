import mongoose from 'mongoose'
import Promise from 'bluebird'
import config from './config'
mongoose.Promise = Promise
const db = mongoose.connect(config.db, { useMongoClient: true }, function (err) {
  if (err) {
    console.error('数据库连接失败！请检查数据库连接及运行状态'.red)
    process.exit()
  }
})
export default db