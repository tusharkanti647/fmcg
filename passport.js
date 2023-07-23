var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require("passport");

const { userModel } = require("./model/userSchema");
const { adminModel } = require('./model/adminSchema');
const secretKey = process.env.KEY;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        //find the admin in admin schema
        const admin = await adminModel.findOne({ _id: jwt_payload._id });
        if (admin) {
            return done(null, admin);
        }

        //find the admin in admin schema
        const user = await userModel.findOne({ _id: jwt_payload._id });
        if (user) {
            return done(null, user);
        }

        //if not find user in admin schema return false
        return done(null, false)
    } catch (err) {
        return done(null, false);
    }
}));
