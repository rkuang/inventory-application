const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { body, validationResult } = require('express-validator');

module.exports = {
  category_list: (req, res, next) => {
    Category.find((err, categories) => {
      if (err) next(err);
      console.log(categories);
      res.render('category_list', {
        title: 'Category List',
        categories: categories
      });
    })
  },
  category_detail: (req, res, next) => {
    async.parallel({
      category: (cb) => {
        Category.findById(req.params.id, cb);
      },
      category_items: (cb) => {
        Item.find({ 'category': req.params.id }, cb)
      }
    }, (err, results) => {
      if (err) next(err);
      if (results.category == null) {
        const error = new Error('Category not found');
        error.status = 404;
        next(error);
      }
      res.render('category_detail', {
        title: 'Category Detail',
          category: results.category,
          category_items: results. category_items
      });
    });
  },
  category_create_get: (req, res, next) => {
    res.render('category_form', {
      title: 'Create Category'
    });
  },
  category_create_post: [
    body('name', 'Name cannot be empty.').trim().not().isEmpty().escape(),
    body('description', 'Description cannot be empty.').trim().not().isEmpty().escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const category = new Category({
        name: req.body.name,
        description: req.body.description
      });
      if (!errors.isEmpty()) {
        res.render('category_form', {
          title: 'Create Category',
          category: category,
          errors: errors.array()
        });
      } else {
        category.save((err) => {
          if (err) next(err);
          res.redirect(category.url);
        });
      }
    }
  ]
}
