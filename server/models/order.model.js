import mongoose from 'mongoose';
import Counter from './counter.model.js';

const orderSchema = new mongoose.Schema(
    {
        ref: {
            type: Number,
            unique: true,
        },
        guestInfo: {
            fullName: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
        },
        inBlacklist: {
            type: Boolean,
            default: false, // Ensure a default in case of schema updates
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
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to auto-increment the ref field
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'orderRef' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );

            this.ref = counter.sequence_value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
