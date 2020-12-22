const Category = require('../models/category');

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
  }
}
