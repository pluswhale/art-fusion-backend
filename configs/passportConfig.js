const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const models = require('../models');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    accessType: 'offline',
    prompt: 'consent'
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const [user, created] = await models.User.findOrCreate({
        where: { googleId: profile.id },
        defaults: {
          email: profile.emails[0].value,
        }
      });

      if (refreshToken) {
        await models.User.update({ refreshToken: refreshToken }, {
          where: { googleId: profile.id }
        });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
      user.dataValues.token = token;

      return cb(null, user);
    } catch (error) {
      return cb(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.User.findByPk(id).then((user) => {
    done(null, user);
  });
});

module.exports = passport;
