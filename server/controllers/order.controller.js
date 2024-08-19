import mongoose from 'mongoose';
import Order from '../models/order.model.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { guestInfo, items, totalPrice, status } = req.body;

        const order = new Order({
            guestInfo,
            items,
            totalPrice,
            status
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
export const deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const result = await Order.deleteOne({ _id: id });

        if (result.deletedCount > 0) {
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order details (e.g., guestInfo, items, totalPrice)
export const updateOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.guestInfo = req.body.guestInfo || order.guestInfo;
            order.items = req.body.items || order.items;
            order.totalPrice = req.body.totalPrice || order.totalPrice;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};