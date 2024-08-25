import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        fullName: {
            type: String,
            required: true,
        }, 
        status: {
            type: Boolean,
            required: true,
            default: true,
        },
        email: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
        }
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
