import express from "express";
import { verifyTokenAdmin } from "../controllers/verifytokenadmin.controller.js";
import {
  createCategory, getCategories, getCategory, updateCategory, deleteCategories, getAllCategories,
  deleteCategory,
} from '../controllers/category.controller.js';
import upload from '../config/upload.js';

const router = express.Router();

router.post('/', verifyTokenAdmin, upload.single('img'), createCategory);
router.post('/delete-multiple', verifyTokenAdmin, deleteCategories);
router.get('/', getCategories);
router.get('/getAll', getAllCategories);
router.get('/:id', getCategory);
router.put('/:id', verifyTokenAdmin, upload.single('img'), updateCategory);
router.delete('/:id', verifyTokenAdmin, deleteCategory);

export default router; 