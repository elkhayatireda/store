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
            
        },
        comparePrice: {
            type: Number,
            
        },
        price: {
            type: Number,
            
        },
        url: {
            type: String,
            
        },
        images: {
            type: [String],
            
        },
        description: {
            type: String,
            
        },
        isVariant: {
            type: Boolean,
        },
        variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }], // Array of variant references
        combinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Combination' }]
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
