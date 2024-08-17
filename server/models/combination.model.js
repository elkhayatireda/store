import mongoose from "mongoose";

const CombinationSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  combination: { type: String, required: true }, // e.g., "Red / Medium"
  variantValues: [
    {
      variantIndex: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant', // assuming 'Variant' is the related model
        required: true,
      },
      valueIndex: {
        type: Number,
        required: true,
      }
    }
  ], // Array of VariantValue IDs
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  image: { type: String }, // Image URL associated with this combination
}, {
  timestamps: true
});
const Combination = mongoose.model('Combination', CombinationSchema);

export default Combination;

