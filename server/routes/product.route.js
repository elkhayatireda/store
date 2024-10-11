import express from "express";
import { verifyTokenAdmin } from "../controllers/verifytokenadmin.controller.js";
import {
  createProduct, getProducts, getProduct, updateProduct, deleteProduct, changeVisibility, deleteProducts, updateImages,
  getvariants, getCombinations, uploadImages, deleteImages,
  getProductsAndCombinations,
  getTopProducts,
  getReviews
} from '../controllers/product.controller.js';
import upload from '../config/upload.js';

const router = express.Router();

router.post('/', upload.array('images', 10), createProduct);
router.post('/hide-show/:id', verifyTokenAdmin, changeVisibility);
router.get('/', getProducts);
router.get('/combinations', getProductsAndCombinations);
router.delete('/:id', verifyTokenAdmin, deleteProduct);
router.post('/delete-multiple', verifyTokenAdmin, deleteProducts);

router.get('/top', getTopProducts);
router.get('/variants/:id', getvariants);
router.get('/combinations/:id', getCombinations);
router.get('/reviews/:id', getReviews);
router.get('/:id', getProduct);

router.post('/upload-images', verifyTokenAdmin, upload.array('images', 10), uploadImages);
router.post('/delete-images', verifyTokenAdmin, deleteImages);
router.post('/update/:id', upload.none(), verifyTokenAdmin, updateProduct);
router.post('/update-images/:id', verifyTokenAdmin, updateImages);


export default router;