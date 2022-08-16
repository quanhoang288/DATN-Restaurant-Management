const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const db = require('../database/models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  console.log(payload);
  try {
    const user = await db.User.findByPk(payload.sub, {
      include: [
        { association: 'staff', include: [{ association: 'role' }] },
        { association: 'customer' },
      ],
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
