import { Router } from 'express'
import { createReservation } from '../controllers/reservation.controllers.js'
const router = Router()

router.get('/', createReservation)

export default router;