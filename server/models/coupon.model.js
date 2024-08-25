import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    appliesToAllProducts: { type: Boolean, default: false },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discountValue: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    minOrderValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    maxUsage: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
