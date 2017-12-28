import mongoose from 'mongoose'
import Promise from 'bluebird'
import config from './config'
// 官方推荐使用bluebird代替原生的promise
mongoose.Promise = Promise
const conn = mongoose.connect(
  config.mongodbUri,
  {
    useMongoClient: true,
    autoReconnect: true,
    poolSize: 10
  },
  function (err) {
    if (err) {
      console.error('数据库连接失败！请检查数据库连接及运行状态'.red)
      process.exit()
    } else {
      console.log('数据库连接成功, 连接地址：'.green + config.mongodbUri)
    }
  }
)

export default conn
