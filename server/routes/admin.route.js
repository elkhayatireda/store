import express from "express";
import { signin, getAdmin, updateAdmin } from '../controllers/admin.controller.js'; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";

const router = express.Router();

// Route to sign in admin
router.post('/signin', signin);

// Route to get admin details
router.get('/', verifyTokenAdmin, getAdmin);

// Route to update admin details
router.put('/', verifyTokenAdmin, updateAdmin);

export default router;