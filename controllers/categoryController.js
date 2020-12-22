const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');

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
  }
}
