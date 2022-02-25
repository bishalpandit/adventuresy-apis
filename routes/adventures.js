import { Router } from 'express'
import { getAdventures, getAdventureById } from '../controllers/adventures.js'
const router = Router()

router.get('/', getAdventures)

router.get('/:id', getAdventureById)

export default router;