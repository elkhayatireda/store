import Review from "../models/review.model.js";
import cloudinary from '../config/cloudinaryConfig.js';

// Create a new review
export const createReview = async (req, res) => { 
 
  try {
    const { fullName, email, productId, rating, description, isImage } = req.body;
    let images = [];
    if(isImage == 'true'){
      images = JSON.parse(req.body.images);
    }else{
      images = [];
    }
      // const combinationDocs = await Promise.all(images.map(combination => {
      //   const variantValues = variantDocs.map(variantDoc => variantDoc._id);
      //   combination.variantIndices.forEach((elem) => {
      //     elem.variantIndex = variantValues[elem.variantIndex];
      //   });
   
    const newReview = new Review({ fullName, email, productId, rating, comment: description, images });
    await newReview.save();
    res.status(201).json({ message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews for a product
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
    .populate('productId', '_id title') // Populate the categoryId with _id and title fields
    .select('_id productId fullName rating images email status comment createdAt'); // Select only the desired fields

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single review by ID
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single review by ID
export const statusReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if(!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    const status = !review.status;
    review.status = status;
    review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteMultiple = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const reviews = await Review.find({ _id: { $in: ids } });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    for (const review of reviews) {
      if (review.images && Array.isArray(review.images)) {
        for (const imagePath of review.images) {
          const publicId = imagePath.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

    }

    await Review.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "reviews deleted successfully" });
  } catch (error) {
    console.error("Error deleting reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update a review
export const updateReview = async (req, res) => {
  try {
    const { fullName, email, productId, rating, description } = req.body;
    const images = JSON.parse(req.body.images);

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
     review.fullName = fullName || review.fullName;
    review.email = email || review.email;
    review.productId = productId || review.productId;
    review.rating = rating !== undefined ? rating : review.rating;  
    review.description = description || review.description;
    review.images =  images ;  

    // Save the updated review
    await review.save();
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
