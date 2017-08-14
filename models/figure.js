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
    default: 'https://cdn4.iconfinder.com/data/icons/app-custom-ui-1/48/Account-32.png',
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