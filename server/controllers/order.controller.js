import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { customerId, items, totalPrice, status } = req.body;

        let customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const order = new Order({
            customerId: customer._id,
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
        // Fetch orders and populate customer information
        const orders = await Order.find({}).populate('customerId');

        // Transform each order to include guestInfo as expected by the frontend
        const ordersWithGuestInfo = orders.map(order => ({
            ...order.toObject(), // Convert the Mongoose document to a plain JavaScript object
            guestInfo: {
                fullName: order.customerId.fullName,
                phone: order.customerId.phone,
                address: order.customerId.address,
                email: order.customerId.email,
            }
        }));

        res.json(ordersWithGuestInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        // Find the order by ID and populate the customer information
        const order = await Order.findById(req.params.id).populate('customerId');

        if (order) {
            // Transform the order to include guestInfo as expected by the frontend
            const orderWithGuestInfo = {
                ...order.toObject(), // Convert the Mongoose document to a plain JavaScript object
                guestInfo: {
                    fullName: order.customerId.fullName,
                    phone: order.customerId.phone,
                    address: order.customerId.address,
                    email: order.customerId.email,
                }
            };

            res.json(orderWithGuestInfo);
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

export const deleteOrders = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        await Order.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "orders deleted successfully" });
    } catch (error) {
        console.error("Error deleting orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};