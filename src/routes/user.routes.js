import { Router } from 'express'
import { getUser, updateUser } from '../controllers/user.controllers.js'
import protect from '../middlewares/authMiddleware.js'

const router = Router();

router.route('/details/:id').get(protect, getUser)

router.route('/update/:id').put(protect, updateUser)

export default router;