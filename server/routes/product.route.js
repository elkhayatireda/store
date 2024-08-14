import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createProduct, getProducts, getProduct, updateProduct, deleteProduct,
  } from './controllers/product.controller.js';


const router = express.Router();

router.post('/products',verifyTokenAdmin, createProduct);
router.get('/products',verifyTokenAdmin, getProducts);
router.get('/products/:id',verifyTokenAdmin, getProduct);
router.put('/products/:id',verifyTokenAdmin, updateProduct);
router.delete('/products/:id',verifyTokenAdmin, deleteProduct);

export default router;