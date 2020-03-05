const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  try {
    await User.validate({email: email}, ['email']);
    const user = await User.findOneAndUpdate({email: email}, {}, {
      upsert: true,
      new: true,
    });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
