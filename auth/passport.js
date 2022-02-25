import db from '../configs/db.js'
import passport from 'passport'
import passoauth from 'passport-google-oauth20'
//const GoogleStrategy = require('passport-google-oauth20').Strategy


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



passport.use(new passoauth.Strategy({
    clientID: "325007616534-ght87o5v9gfpmcc4b8cla8pd2cq7ilk0.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/users/oauth/redirect/google",
    passReqToCallback: true,
},
    async (request, accessToken, refreshToken, profile, done) => {

        const userExists = await db.query('SELECT ID FROM USERS WHERE EMAIL_ID = $1', [profile.id])
    
        const newUser = {
            f_name: profile.name.givenName,
            l_name: profile.name.familyName,
            email: profile.emails[0].value,
            hashedPassword: 'GoogleID',
            mobile: ''
        }
        if (!userExists.rowCount) {

            const Insertquery = {
                text: 'INSERT INTO users(googleid, first_name, last_name, email_id, password) VALUES($1, $2, $3, $4, $5)',
                values: [profile.id, newUser.f_name, newUser.l_name, newUser.email, newUser.hashedPassword],
            }
            const userRecord = await db.query(Insertquery)
        }
        return done(null, profile)
    }
));
