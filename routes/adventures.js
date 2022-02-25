import { Router } from 'express'
import { getAdventures, getAdventureById } from '../controllers/adventures.js'
const router = Router()

// api/adventures?ctype=popular&limit=5
router.get('/', getAdventures)

// api/adventures/:id
router.get('/:id', getAdventureById)

// api/adventures/category?c1=skiing%20scuba%20surfing
router.get('/category', getAdventureByCategory)

// api/adventures/search?loc=india&cat=skiing&part=triogo
router.get('/search', getAdventuresBySearch)

// api/adventures/filter?
router.get('/filter', getAdventureByFilter)

// api/adventures/geoloc
router.get('/geoloc', getAdventureByGeoLoc)

export default router;

