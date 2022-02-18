const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
 
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "325007616534-ght87o5v9gfpmcc4b8cla8pd2cq7ilk0.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/users/oauth/redirect/google",
    passReqToCallback: true,
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile)
    }
));