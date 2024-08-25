import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createCoupon, getCoupons, changeStatusCoupon, deleteCoupon, deleteMultiple, updateCoupon, getCoupon
  } from '../controllers/coupon.controller.js';
  import upload from '../config/upload.js';

const router = express.Router();
 
router.post('/',upload.none(),verifyTokenAdmin, createCoupon);  
router.post('/update/:id', upload.none(), verifyTokenAdmin, updateCoupon);
router.post('/status/:id', verifyTokenAdmin, changeStatusCoupon);
router.post('/delete-multiple', verifyTokenAdmin, deleteMultiple);
router.get('/',verifyTokenAdmin, getCoupons);  
router.get('/:id',verifyTokenAdmin, getCoupon);
router.delete('/:id',verifyTokenAdmin, deleteCoupon); 

 


export default router;