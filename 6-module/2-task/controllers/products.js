const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;
  if (!subcategory) {
    return next();
  }
  const products = await Product.find({subcategory: subcategory});
  const productsMap = products.map( (product) => {
    return product.toJSON();
  });
  ctx.body = {products: productsMap};
  return ctx.status = 200;
};

module.exports.productList = async function productList(ctx, next) {
  products = await Product.find({});
  if (!products) {
    ctx.throw(404, 'Not found');
  }
  const productsMap = products.map( (product) => {
    return product.toJSON();
  });
  ctx.body = {products: productsMap};
  ctx.status = 200;
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'Invalid data');
  }
  const product = await Product.findOne({_id: id});

  if (!product) {
    ctx.throw(404, 'Not found');
  }

  ctx.body = {product: product.toJSON()};
  ctx.status = 200;
};

