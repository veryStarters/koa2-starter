import redis from 'redis'
import Promise from 'bluebird'
import config from './config'

Promise.promisifyAll(redis.RedisClient.prototype)
const redisClient = redis.createClient(config.redis[process.env.NODE_ENV || 'development'])

redisClient.on('error', err => {
  console.log('Redis连接失败: '.red, err)
}).on('connect', () => {
  console.log('缓存服务连接成功！请通过: '.green, 'setCache 和 getCache 来设置和获取缓存内容')
})

export const getCache = async (key) => {
  return await redisClient.getAsync(key)
}
export const setCache = async (key, value) => {
  return redisClient.set(key, value)
}
export default redisClient
