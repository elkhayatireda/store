import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        items: [
            {
                id: {
                    type: String,
                },
                title: {
                    type: String,
                    required: true,
                },
                variant: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                unitPrice: {
                    type: Number,
                    required: true,
                }
            }
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
