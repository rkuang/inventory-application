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
  },
  item_detail: (req, res, next) => {
    Item.findById(req.params.id).populate('category').exec((err, item) => {
      if (err) next(err);
      res.render('item_detail', {
        title: 'Item Detail',
        item: item
      })
    })
  }
}
