const passport = require('../libs/passport');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user || user.verificationToken) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const token = await ctx.login(user);

    ctx.body = {token};
  })(ctx, next);
};
