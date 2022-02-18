import { Router } from 'express'
import { getUserByID, registerUser } from '../controllers/users.js'

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

export default router;