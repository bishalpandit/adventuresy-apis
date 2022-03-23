import { Router } from 'express'
import {  } from '../controllers/adventures.js'
const router = Router()

router.get('/', createReservation)

export default router;