import { Router } from 'express'
import { getAdventures, getAdventureById, getAdventuresByCategory, getAdventuresBySearch, getAvailableDates, getAdventuresByFilter } from '../controllers/adventure.controllers.js'
const router = Router()

// Type -> Adventure, Sport, Event 

// api/adventures?ctype=popular&limit=5
router.get('/', getAdventures)

// api/adventures/:id
router.get('/details/:id', getAdventureById)

// api/adventures/category?categ=skiing%20scuba%20surfing
router.get('/category', getAdventuresByCategory)

// api/adventures/search?loc=india&cat=skiing&part=triogo
router.get('/search', getAdventuresBySearch)

// api/adventures/filter?
router.get('/filter', getAdventuresByFilter)

// api/adventures/geoloc
// router.get('/geoloc', getAdventureByGeoLoc)

//router.post('/logs', adventureLogs);

export default router;

