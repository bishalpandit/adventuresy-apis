import { Router } from 'express'
import passport from 'passport'
import { getUserByID, registerUser, loginUser, updateUser } from '../controllers/user.controllers.js'
import protect from '../middlewares/authMiddleware.js'
import { CLIENT_URL } from '../configs/index.js'

const router = Router();

router.route('/signup').post(registerUser)

router.route('/signin').post(loginUser)

router.route('/signin/google')
    .get(passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ))

router.get('/oauth/redirect/google',
    passport.authenticate('google', {
        successRedirect: `${CLIENT_URL}/`,
        failureRedirect: '/login/failed',
    })
);

router.get("/auth/logout", (req, res) => {
    if (req.user) {
        req.logout();
        res.send("done");
    }
})


router.route('/details/:id').get(protect, getUserByID)

router.route('/update/:id').put(protect, updateUser)

export default router;