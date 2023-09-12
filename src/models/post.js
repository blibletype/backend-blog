const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    creator: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
