import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createProduct, getProducts, getProduct, updateProduct, deleteProduct,
  } from '../controllers/product.controller.js';
  import upload from '../config/upload.js';

const router = express.Router();

router.post('/', upload.array('images', 10), createProduct);  
router.get('/products',verifyTokenAdmin, getProducts);
router.get('/products/:id',verifyTokenAdmin, getProduct);
router.put('/products/:id',verifyTokenAdmin, updateProduct);
router.delete('/products/:id',verifyTokenAdmin, deleteProduct);

export default router;