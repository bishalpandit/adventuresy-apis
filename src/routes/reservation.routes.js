import { Router } from 'express'
import { createReservation } from '../controllers/reservation.controllers.js'
import protect from '../middlewares/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/', createReservation)

export default router;