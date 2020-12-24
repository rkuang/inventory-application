const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
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
        quantity: req.body.quantity,
        image_path: req.file ? '/uploads/'+req.file.filename : undefined,
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
  ],
  item_delete_get: (req, res, next) => {
    Item.findById(req.params.id, (err, item) => {
      if (err) next(err);
      if (item == null) {
        const error = new Error('Item not found.');
        error.status = 404;
        next(error);
      }
      res.render('item_delete', {
        title: 'Delete Item',
        item: item,
      });
    });
  },
  item_delete_post: (req, res, next) => {
    Item.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) next(err);
      res.redirect('/items');
    });
  },
  item_update_get: (req, res, next) => {
    async.parallel({
      item: (cb) => {
        Item.findById(req.params.id, cb);
      },
      categories: (cb) => {
        Category.find({}, 'name').sort([['name', 'asc']]).exec(cb);
      }
    }, (err, results) => {
      if (err) next(err);
      if (results.item == null) {
        const error = new Error('Item not found.');
        error.status = 404;
        next(error);
      }
      res.render('item_form', {
        title: 'Update Item',
        item: results.item,
        categories: results.categories
      });
    });
  },
  item_update_post: [
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
        quantity: req.body.quantity,
        image_path: req.file ? '/uploads/'+req.file.filename : undefined,
        _id: req.params.id
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
        Item.findByIdAndUpdate(req.params.id, item, (err, result) => {
          if (err) next(err);
          res.redirect(result.url);
        })
      }
    }
  ]
}
