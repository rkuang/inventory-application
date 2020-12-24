var express = require('express');
var router = express.Router();

const path = require('path');
const multer = require('multer');
const upload = multer(
  {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "tmp/uploads");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      }
    }),
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      if (![".png", ".jpg", ".gif", ".jpeg"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, true);
    },
    limits: {
      fileSize: 1000000
    }
  });

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/items', itemController.item_list);
router.get('/item/create', itemController.item_create_get);
router.post('/item/create', upload.single('image'), itemController.item_create_post);
router.get('/item/:id', itemController.item_detail);
router.get('/item/:id/delete', itemController.item_delete_get);
router.post('/item/:id/delete', itemController.item_delete_post);
router.get('/item/:id/update', itemController.item_update_get);
router.post('/item/:id/update', upload.single('image'), itemController.item_update_post);

router.get('/categories', categoryController.category_list);
router.get('/category/create', categoryController.category_create_get);
router.post('/category/create', categoryController.category_create_post)
router.get('/category/:id', categoryController.category_detail);
router.get('/category/:id/delete', categoryController.category_delete_get);
router.post('/category/:id/delete', categoryController.category_delete_post);
router.get('/category/:id/update', categoryController.category_update_get);
router.post('/category/:id/update', categoryController.category_update_post);

module.exports = router;
