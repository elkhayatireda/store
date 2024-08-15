import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        comparePrice: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        variants: [
            {
                name: {
                    type: String,
                    required: true,
                },
                values: [
                    {
                        value: {
                            type: String,
                            required: true,
                        },
                        img: {
                            type: String,
                        },
                        price: {
                            type: Number,
                        }
                    }
                ]
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
