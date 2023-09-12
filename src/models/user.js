const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'I an newie!'
  },
  posts: [{
    type: Types.ObjectId,
    ref: 'Post'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);