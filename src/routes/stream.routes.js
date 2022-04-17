import { Router } from 'express'
import { streamSplashVideo } from '../controllers/stream.controllers.js'

const router = Router();

router.route('/splash').get(streamSplashVideo);

export default router;