import { Router } from 'express'
import { getAdventures, getAdventureById, getAdventuresByCategory, getAdventuresBySearch, getAvailableDates, getAdventuresByFilter } from '../controllers/adventure.controllers.js'
import protect from '../middlewares/authMiddleware.js'
const router = Router()

// Type -> Adventure, Sport, Event, Concert, Animal 

//router.use(protect);

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

// api/adventures/avail/3jif3f93asf/?date? | for march month -> send the month year and get the available dates...
router.get('/availdates/:pid/:aid', getAvailableDates)

//router.post('/logs', adventureLogs);

export default router;

