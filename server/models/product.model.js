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
        discount: {
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
        visible: {
            type: Boolean,
        },
        differentPrice: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
);
productSchema.pre('save', function (next) {
    if (this.comparePrice && this.price) {
        // Calculate the discount percentage
        this.discount = ((this.comparePrice - this.price) / this.comparePrice) * 100;
    } else {
        // Set discount to 0 if comparePrice or price is not defined
        this.discount = 0;
    }
    next();
});
const Product = mongoose.model('Product', productSchema);

export default Product;
