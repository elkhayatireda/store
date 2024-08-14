import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createReview, getReviews, getReview, updateReview, deleteReview,
  } from './controllers/review.controller.js';


const router = express.Router();

router.post('/reviews',verifyTokenAdmin, createReview);
router.get('/reviews/:productId',verifyTokenAdmin, getReviews);
router.get('/reviews/:id',verifyTokenAdmin, getReview);
router.put('/reviews/:id',verifyTokenAdmin, updateReview);
router.delete('/reviews/:id',verifyTokenAdmin, deleteReview);

export default router;