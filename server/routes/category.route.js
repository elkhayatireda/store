import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createCategory, getCategories, getCategory, updateCategory, deleteCategory,
  } from './controllers/category.controller.js';


const router = express.Router();

router.post('/categories',verifyTokenAdmin, createCategory);
router.get('/categories',verifyTokenAdmin, getCategories);
router.get('/categories/:id',verifyTokenAdmin, getCategory);
router.put('/categories/:id',verifyTokenAdmin, updateCategory);
router.delete('/categories/:id',verifyTokenAdmin, deleteCategory);

export default router;