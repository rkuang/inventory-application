var express = require('express');
var router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/items', itemController.item_list);
router.get('/categories', categoryController.category_list);

module.exports = router;
