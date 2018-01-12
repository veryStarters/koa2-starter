import mongoose from 'mongoose'

/**
 * 定义模型数据骨架
 */
const UserSchema = new mongoose.Schema({
  id: Number,
  name: String,
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
UserSchema.pre("save",function(next){
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
  getName: function () {
    return this.name
  }
})

/**
 * 定义模型静态方法
 * @type {{findByName: mongoose.Schema.statics.findByName, findUsers: mongoose.Schema.statics.findUsers, addUser: mongoose.Schema.statics.addUser, removeByName: mongoose.Schema.statics.removeByName}}
 */
UserSchema.statics = {
  findByName: function (name) {
    return this.findOne({name: name})
  },
  findUsers: function () {
    return this.find()
  },
  addUser: function (userInfo) {
    return this.create(userInfo)
  },
  removeByName: function (name) {
    return this.remove({name: name})
  }
}

export default mongoose.model('User', UserSchema)
