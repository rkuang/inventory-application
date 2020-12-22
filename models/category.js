const path = require('path');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

CategorySchema
.virtual('url')
.get( function() {
  return path.join('/category', this._id.toString());
});

module.exports = mongoose.model('Category', CategorySchema);
