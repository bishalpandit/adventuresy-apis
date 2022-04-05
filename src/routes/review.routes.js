import { Router } from 'express'
import { createReview } from '../controllers/review.controllers.js'
const router = Router();

//router.get('/:adventureid', getReviewsByAdventure);

//router.get('/:partnerid', getReviewsByPartner);

router.post('/', createReview);

// router.put('/:reviewid', updateReview);

// router.delete('/:reviewid', deleteReview);


export default router;

