import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true }, 
  values: [{ type: String, required: true }] 
}, {
  timestamps: true
});

const Variant = mongoose.model('Variant', VariantSchema);

export default Variant;
