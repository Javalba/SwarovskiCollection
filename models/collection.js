const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
  name: String,
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  figures: [{
    type: Schema.Types.ObjectId,
    ref: 'Figure'
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Collection', CollectionSchema);
