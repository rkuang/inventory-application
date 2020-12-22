const path = require('path');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
});

ItemSchema
.virtual('url')
.get( function() {
  return path.join('/item', this._id.toString());
});

ItemSchema
.virtual('price_formatted')
.get( function() {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  return formatter.format(this.price);
})

module.exports = mongoose.model('Item', ItemSchema);
