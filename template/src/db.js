import mongoose from 'mongoose'
import Promise from 'bluebird'
import config from './config'
// 官方推荐使用bluebird代替mongoose原生的promise
mongoose.Promise = Promise
const db = mongoose.connect(config.db, { useMongoClient: true }, function (err) {
  if (err) {
    console.error('数据库连接失败！请检查数据库连接及运行状态'.red)
    process.exit()
  } else {
    console.log('数据库连接成功, 连接地址：'.green + 'mongodb://127.0.0.1/demo')
  }
})
export default db