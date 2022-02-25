import { Router } from 'express'
import { getAllAdventures } from '../controllers/adventures.js'
const router = Router()

router.get('/', getAllAdventures)

export default router;