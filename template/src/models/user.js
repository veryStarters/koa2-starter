import mongoose from 'mongoose'

/**
 * 定义模型数据骨架
 */
const UserSchema = new mongoose.Schema({
  id: Number,
  name: String,
  password: String,
  age: Number,
  gender: {
    type: String,
    default: '男'
  },
  createTime: Number,
  upDateTime: Number
})

/**
 * 定义存储拦截器
 */
UserSchema.pre("save", (next) => {
  if(this.isNew) {
    this.createTime = this.upDateTime = Date.now()
  } else {
    this.upDateTime = Date.now()
  }
  next()
})

/**
 * 定义模型实例方法
 */
UserSchema.method({
  getName() {
    return this.name
  }
})

/**
 * 定义模型静态方法
 */
UserSchema.statics = {
  findByName(name) {
    return this.findOne({name: name})
  },
  findUsers() {
    return this.find()
  },
  addUser(userInfo) {
    return this.create(userInfo)
  },
  removeByName(name) {
    return this.remove({name: name})
  }
}

export default mongoose.model('User', UserSchema)
