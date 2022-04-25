import userRoutes from './user.routes.js'
import adventureRoutes from './adventure.routes.js'
import reviewRoutes from './review.routes.js'
import reservationRoutes from './reservation.routes.js'
import streamRoutes from './stream.routes.js'
import authRoutes from './auth.routes.js'
import { Router } from 'express'

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/adventures', adventureRoutes);
router.use('/reviews', reviewRoutes);
router.use('/reservations',reservationRoutes);
router.use('/stream', streamRoutes);

export default router;