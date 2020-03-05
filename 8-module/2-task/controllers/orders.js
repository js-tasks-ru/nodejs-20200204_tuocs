const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const user = ctx.user;
  const {product, phone, address} = ctx.request.body;
  const order = await Order.create({
    user: user,
    product: product,
    phone: phone,
    address: address,
  });
  await sendMail({
    to: user.email,
    subject: 'Подтвердите заказ',
    locals: {id: order.id, product: product},
    template: 'order-confirmation',
  });
  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id});
  const orderMaps = orders.map((order) => mapOrder(order));
  ctx.body = {orders: orderMaps};
};
