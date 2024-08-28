import Coupon from "../models/coupon.model.js";
import cloudinary from "../config/cloudinaryConfig.js";

// Create a new review
export const createCoupon = async (req, res) => {
  try {
    const {
      Code,
      selectedDiscountType,
      value,
      minOrderValue,
      date,
      allProduct,
      active,
      maxUsage,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code: Code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    let selectedProducts = [];
    if (allProduct) {
      selectedProducts = JSON.parse(req.body.selectedProducts);
    }

    const couponData = {
      code: Code,
      productIds: allProduct ? [] : selectedProducts,
      appliesToAllProducts: allProduct,
      discountType: selectedDiscountType,
      discountValue: value,
      expirationDate: new Date(date),
      minOrderValue,
      isActive: active,
      maxUsage,
    };

    const newCoupon = new Coupon(couponData);
    await newCoupon.save();
    res.status(201).json({ message: "Coupon created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeStatusCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "coupon not found" });
    }
    const status = !coupon.isActive;
    coupon.isActive = status;
    coupon.save();
    res.status(200).json({ message: "coupon updated!" });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "coupon not found" });
    }
    res.status(200).json({ message: "coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteMultiple = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const coupons = await Coupon.find({ _id: { $in: ids } });

    if (coupons.length === 0) {
      return res.status(404).json({ message: "No coupons found" });
    }

    await Coupon.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "coupons deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateCoupon = async (req, res) => {
  try {
    const {
      Code,
      selectedDiscountType,
      value,
      minOrderValue,
      date,
      allProduct,
      active,
      maxUsage,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code: Code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "coupon not found" });
    }
    let selectedProducts = [];
    if (allProduct == "false") {
      selectedProducts = JSON.parse(req.body.selectedProducts);
    }
    

    coupon.code = Code || coupon.code;
    coupon.discountType = selectedDiscountType || coupon.discountType;
    coupon.appliesToAllProducts = allProduct || coupon.appliesToAllProducts;
    coupon.discountValue = value || coupon.discountValue;
    coupon.expirationDate = new Date(date);
    coupon.minOrderValue = minOrderValue || coupon.minOrderValue;
    coupon.isActive = active || coupon.isActive;
    coupon.maxUsage = maxUsage || coupon.maxUsage;
    if (allProduct == "false") {
      console.log("dddddd1")
      coupon.productIds = selectedProducts;
    }else{
        coupon.productIds = [];
    }

    // Save the updated coupon
    await coupon.save();
    res.status(200).json({ message: "coupon updated successfully" });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
