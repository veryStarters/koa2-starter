import db from 'db'
import UserSchema from 'schemas/user'
const UserModel = db.model('User', UserSchema)
UserModel.findUsers = function () {
  return UserModel.find().exec()
}
export default UserModel