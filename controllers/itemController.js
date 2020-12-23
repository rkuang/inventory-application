const Item = require('../models/item');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');

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
  },
  item_create_get: (req, res, next) => {
    Category.find({}, 'name').sort([['name', 'asc']]).exec((err, categories) => {
      if (err) next(err);
      res.render('item_form', {
        title: 'Create Item',
        categories: categories
      })
    })
  },
  item_create_post: [
    body('name', 'Name cannot be empty').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description cannot be empty').trim().isLength({ min: 1 }).escape(),
    body('category', 'Category cannot be empty').trim().isLength({ min: 1 }).escape(),
    body('price').trim().not().isEmpty().withMessage('Price cannot be empty')
    .isCurrency({allow_negatives: false}).withMessage('Price is not in valid format.').escape(),
    body('quantity').trim().not().isEmpty().withMessage('Quantity cannot be empty.')
    .isInt({ min: 0 }).withMessage('Quantity cannot be negative').escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
      });
      if (!errors.isEmpty()) {
        Category.find({}, 'name').sort([['name', 'asc']]).exec((err, categories) => {
          if (err) next(err);
          res.render('item_form', {
            title: 'Create Item',
            item: item,
            categories: categories,
            errors: errors.array()
          })
        })
      } else {
        item.save((err) => {
          if (err) next(err);
          res.redirect(item.url);
        });
      }
    }
  ]
}
