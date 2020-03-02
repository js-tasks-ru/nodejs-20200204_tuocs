const Category = require('../models/Category');
module.exports.categoryList = async function categoryList(ctx, next) {
  const categoryList = await Category.find({});
  const categoryMap = categoryList.map( (category) => {
    return category.toJSON();
  });
  ctx.status = 200;
  ctx.body = {categories: categoryMap};
};
