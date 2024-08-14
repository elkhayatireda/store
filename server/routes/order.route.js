import express from "express"; 
import { verifyTokenAdmin  } from "../controllers/verifytokenadmin.controller.js";
import {
    createOrder, getOrders, getOrder, updateOrder, deleteOrder,
  } from './controllers/order.controller.js';


const router = express.Router();

router.post('/orders',verifyTokenAdmin, createOrder);
router.get('/orders',verifyTokenAdmin, getOrders);
router.get('/orders/:id',verifyTokenAdmin, getOrder);
router.put('/orders/:id',verifyTokenAdmin, updateOrder);
router.delete('/orders/:id',verifyTokenAdmin, deleteOrder);

export default router;