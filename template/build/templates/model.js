module.exports = `/**
 * 本文件为model模板文件, 由脚手架自动生成，内置模型定义骨架，包含存储拦截器及实例和静态方法定义
 */
import mongoose from 'mongoose'

/**
 * 定义模型数据骨架
 */
const __modelName__Schema = new mongoose.Schema({

})

/**
 * 定义存储拦截器
 */
__modelName__Schema.pre("save", (next) => {
  next()
})

/**
 * 定义模型实例方法
 */
__modelName__Schema.method({
  log() {
    console.log('Hello, World!')
  }
})

/**
 * 定义模型静态方法
 */
__modelName__Schema.statics = {
  findById(id) {
    return this.findOne({_id: id})
  }
}

export default mongoose.model('__modelName__', __modelName__Schema)

`
