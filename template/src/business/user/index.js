import User from 'models/user'
export default {
  async getAllUsers() {
    return User.get
  }
}