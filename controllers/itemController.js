const Item = require('../models/item');

module.exports = {
  item_list: (req, res, next) => {
    Item.find().populate('category').exec((err, items) => {
      if (err) next(err);
      res.render('item_list', {
        title: 'Item List',
        items: items
      });
    })
  }
}
