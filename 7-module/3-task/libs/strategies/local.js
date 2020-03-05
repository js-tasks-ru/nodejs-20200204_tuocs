const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
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
    }
);
