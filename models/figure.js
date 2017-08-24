const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FigureSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  available: Date,
  designer: String,
  number: Number,
  collec: String,
  adquisitionPrice: Number,
  personalNotes: String,
  image: {
    type: String,
    default: 'https://is1-ssl.mzstatic.com/image/thumb/Purple60/v4/be/90/34/be903439-23a2-2fa8-dee5-f5beb9c36bc6/source/256x256bb.jpg',
  },
  favorite: Boolean,
  sell: Boolean
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Figure',FigureSchema);