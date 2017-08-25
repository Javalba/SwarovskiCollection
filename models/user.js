const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  surname: String,
  address: String,
  email: String,
  city: String,
  country: String,
  avatar: {
    type: String,
    default: 'https://cdn4.iconfinder.com/data/icons/app-custom-ui-1/48/Account-32.png',
  },
  birthday: Date,
  password: String,
  googleID: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

