import { Router } from 'express'
import passport from 'passport'
import { getUserByID, registerUser, loginUser, updateUser } from '../controllers/users.js'

const router = Router()

/** 
@desc get a user by id
@route GET api/users/:id
@access Protected
*/

router.route('/:id').get(getUserByID)

/** 
@desc singup new user
@route POST api/users/signup
@access Public
*/

router.route('/signup').post(registerUser)

/** 
@desc user login
@route POST api/users/signin
@access Public
*/

router.route('/signin').post(loginUser)

router.route('/signin/google')
.get(passport.authenticate('google', {
    scope:
        ['email', 'profile']
}
))
.get('/oauth/redirect/google',
passport.authenticate('google', {
    failureRedirect: '/signin',
}),
loginUserGoogle
);


/** 
@desc user login
@route POST api/users/signin
@access Public
*/

router.route('/update/:id').put(updateUser)

export default router;