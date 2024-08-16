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
        variants: [
            {
                name: {
                    type: String,
                    
                },
                values: [
                    {
                        value: {
                            type: String,
                            
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
