#! /usr/bin/env node

console.log('This script populates some test items and categories to your database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
require('dotenv').config()
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = {}

function itemCreate(name, description, category, price, quantity, cb) {
  var item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    quantity: quantity
  });
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    cb(null, item)
  });
}

function categoryCreate(name, description, cb) {
  var category = new Category({
    name: name,
    description: description
  });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories[category.name] = category;
    cb(null, category);
  });
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Vegetable', 'Broccoli, carrots, potatos, etc.', callback);
        },
        function(callback) {
          categoryCreate('Fruit', 'Apples, oranges, bananas, etc.', callback);
        },
        function(callback) {
          categoryCreate('Grain', 'Bread, cereal, pasta, etc.', callback);
        },
        function(callback) {
          categoryCreate('Protein', 'Meat, poultry, fish, beans, etc.', callback);
        },
        function(callback) {
          categoryCreate('Dairy', 'Milk, cheese, yogurt, etc.', callback);
        }
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Milk', 'Milk is a nutrient-rich liquid food produced by the mammary glands of mammals.', categories['Dairy'], 2.99, 50, callback);
        },
        function(callback) {
          itemCreate('Ground Beef', 'Chopped fresh and/or frozen beef from primal cuts and trimmings.', categories['Protein'], 15.99, 30, callback);
        },
        function(callback) {
          itemCreate('Apple', 'The apple is a pome (fleshy) fruit, in which the ripened ovary and surrounding tissue both become fleshy and edible.', categories['Fruit'], 0.99, 100, callback);
        },
        function(callback) {
          itemCreate('Bread', 'Bread is a staple food prepared from a dough of flour and water, usually by baking.', categories['Grain'], 1.99, 46, callback);
        },
        function(callback) {
          itemCreate('Rice', 'Rice is the seed of the grass species Oryza glaberrima (African rice) or Oryza sativa (Asian rice).', categories['Grain'], 24.99, 24, callback);
        },
        function(callback) {
          itemCreate('Broccoli', 'Broccoli is a cruciferous vegetable, alongside kale, cauliflower, Brussels sprouts, bok choy, cabbage, collard greens, rutabaga, and turnips.', categories['Vegetable'], 4.99, 50, callback);
        },
        function(callback) {
          itemCreate('Tomato', 'Tomatoes are fruits that are considered vegetables by nutritionists.', categories['Fruit'], 0.99, 42, callback);
        },
        function(callback) {
          itemCreate('Chicken Breast', 'The chicken breast is a lean cut of meat taken from the pectoral muscle on the underside of the chicken.', categories['Protein'], 12.99, 39, callback);
        },
        function(callback) {
          itemCreate('Avocado', 'Avocado, also called alligator pear, fruit of Persea americana of the family Lauraceae, a tree native to the Western Hemisphere from Mexico south to the Andean regions.', categories['Fruit'], 3.99, 17, callback);
        },
        function(callback) {
          itemCreate('Cheese', 'Cheese is nutritious food made mostly from the milk of cows but also other mammals, including sheep, goats, buffalo, reindeer, camels and yaks.', categories['Dairy'], 2.99, 50, callback);
        },
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
