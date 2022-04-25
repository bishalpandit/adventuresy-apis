import { db } from '../configs/index.js'
import passport from 'passport'
import passoauth from 'passport-google-oauth20'


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



passport.use(new passoauth.Strategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/oauth/redirect/google",
    passReqToCallback: true,
},
    async (request, accessToken, refreshToken, profile, done) => {

        try {
            const userExists = await db.query('SELECT * FROM USERS WHERE googleID = $1', [profile.id]);
            delete userExists['password'];

            if (!userExists.rowCount) {
                const newUser = {
                    f_name: profile.name.givenName,
                    l_name: profile.name.familyName,
                    email: profile?.emails[0].value,
                    hashedPassword: 'GoogleID',
                    mobile: ''
                }

                const Insertquery = {
                    text: 'INSERT INTO users(googleid, first_name, last_name, email_id, password) VALUES($1, $2, $3, $4, $5)',
                    values: [profile.id, newUser.f_name, newUser.l_name, newUser.email, newUser.hashedPassword],
                }

                const user = await db.query(Insertquery);
                return done(null, user.rows[0]);
            }
            return done(null, userExists.rows[0]);
        } catch (error) {
            return done(error, null);
        }
    }
));
