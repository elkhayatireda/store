import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createReview, getReviews, getReview, updateReview, deleteReview, statusReview, deleteMultiple
  } from '../controllers/review.controller.js';

  import upload from '../config/upload.js';

const router = express.Router();

router.post('/',upload.none(), verifyTokenAdmin, createReview);
router.post('/status/:id', verifyTokenAdmin, statusReview);
router.post('/delete-multiple', verifyTokenAdmin, deleteMultiple);
router.get('/',verifyTokenAdmin, getReviews);
router.get('/:id',verifyTokenAdmin, getReview);
router.post('/update/:id', upload.none(), verifyTokenAdmin, updateReview);
router.delete('/:id',verifyTokenAdmin, deleteReview); 

export default router;