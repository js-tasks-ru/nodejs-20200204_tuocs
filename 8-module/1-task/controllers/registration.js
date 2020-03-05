const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  try {
    const {email, displayName, password} = ctx.request.body;
    const user = new User({
      email: email,
      displayName: displayName,
      verificationToken: verificationToken,
    });
    await user.setPassword(password);
    await user.save();
    await sendMail({
      template: 'confirmation',
      locals: {token: user.verificationToken},
      to: user.email,
      subject: 'Подтвердите почту',
    });
    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (err) {
    if (err.errors.email) {
      ctx.status = 400;
      ctx.body = {errors: {email: err.errors.email.message}};
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  if (!verificationToken) {
    ctx.throw(400, 'Invalid token');
  }
  const user = await User.findOne({verificationToken: verificationToken});
  if (!user) {
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }
  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.status = 200;
  ctx.body = {token};
};
