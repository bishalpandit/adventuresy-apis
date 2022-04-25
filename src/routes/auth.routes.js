import { Router } from 'express'
import passport from 'passport'
import { register, jwtLogin, checkAuth, logout } from '../controllers/auth.controllers.js'
import { SUCCESS_URL, LOGIN_URL } from '../configs/index.js'
import protect from '../middlewares/authMiddleware.js'

const router = Router();

router.route('/register').post(register)

router.route('/login').post(jwtLogin)

router.route('/login/google')
    .get(passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
));

router.get('/user', protect, checkAuth);

router.get('/oauth/redirect/google',
    passport.authenticate('google', {
        successRedirect: SUCCESS_URL,
        failureRedirect: LOGIN_URL,
        failureMessage: "Cannot login to Google, please try again later!",
    })
);

router.get("/logout", protect, logout)

export default router;