const Item = require('../models/item');

module.exports = {
  item_list: (req, res, next) => {
    Item.find().populate('category').exec((err, items) => {
      if (err) next(err);
      console.log(items[0].category._id)
      res.render('item_list', {
        title: 'Item List',
        item_list: items
      });
    })
  }
}
