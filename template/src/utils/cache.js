import redis from 'redis'
import Promise from 'bluebird'
import config from 'config'

Promise.promisifyAll(redis.RedisClient.prototype)
const redisClient = redis.createClient(config.redis[process.env.NODE_ENV || 'development'])

redisClient.on('error', err => {
  console.log('Redis连接失败: '.red, err)
}).on('connect', () => {
  console.log('缓存服务连接成功！请通过: '.green, 'setCache 和 getCache 来设置和获取缓存内容')
})

/**
 * 获取key值
 * @param key
 * @returns {Promise.<*>}
 */
export const getCache = async (key) => {
  return await redisClient.getAsync(key)
}

/**
 * 设置key值
 * @param key
 * @param value
 * @param duration  过期时间，秒
 * @returns {Promise.<*>}
 */
export const setCache = async (key, value, duration) => {
  let ret = await redisClient.set(key, value)
  if(duration) {
    redisClient.expire(key, duration)
  }
  return ret
}

/**
 * 删除key值
 * @param key
 * @returns {Promise.<*>}
 */
export const removeCache = async (key) => {
  return await redisClient.del(key)
}
export default redisClient
