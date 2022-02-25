import { Router } from 'express'
import passport from 'passport'
import { getUserByID, registerUser, loginUser, updateUser } from '../controllers/users.js'
const router = Router()


router.route('/:id').get(getUserByID)

router.route('/signup').post(registerUser)

router.route('/signin').post(loginUser)

router.route('/signin/google')
    .get(passport.authenticate('google', {
        scope:
            ['profile']
    }
    ))

router.get('/oauth/redirect/google',
    passport.authenticate('google', {
        failureRedirect: '/failure',
        successRedirect: '/'
    })
);


router.route('/update/:id').put(updateUser)

export default router;