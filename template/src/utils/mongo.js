import mongoose from 'mongoose'
import Promise from 'bluebird'
import config from 'config'
import getLogger from 'utils/getLogger'
const logger = getLogger('db ')

// 官方推荐使用bluebird代替原生的promise
mongoose.Promise = Promise

const mongoConnect = (opt, callback) => {
  let uri = config.mongodbUri[process.env.NODE_ENV || 'development']
  if (typeof opt === 'function') {
    callback = opt
    opt = {}
  }
  mongoose.connect(uri,
    Object.assign({
      useMongoClient: true,
      autoReconnect: true,
      poolSize: 10
    }, opt || {}),
    function (err) {
      if (err) {
        logger.error('数据库连接失败！请检查数据库连接及运行状态')
        process.exit()
      } else {
        logger.info('数据库连接成功, 连接地址：' + uri)
      }
      callback && callback.apply(null, arguments)
    }
  )
}
export default mongoConnect
