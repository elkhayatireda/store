import express from "express";
import { verifyTokenAdmin } from "../controllers/verifytokenadmin.controller.js";
import {
  createOrder,
  deleteOrders,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderDetails,
  updateOrderStatus,
} from '../controllers/order.controller.js';


const router = express.Router();

router.post('/', verifyTokenAdmin, createOrder);
router.post('/delete-multiple', verifyTokenAdmin, deleteOrders);
router.get('/', verifyTokenAdmin, getAllOrders);
router.get('/:id', verifyTokenAdmin, getOrderById);
router.put('/status/:id', verifyTokenAdmin, updateOrderStatus);
router.put('/details/:id', verifyTokenAdmin, updateOrderDetails);
router.delete('/:id', verifyTokenAdmin, deleteOrder);

export default router;