import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import cloudinary from '../config/cloudinaryConfig.js';

export const createCategory = async (req, res) => {
  const { title, description } = req.body;
  try {
    // Check if a category with the same title already exists
    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({ message: "Category title already exists" });
    }

    let imgPath = null;
    if (req.file) {
      imgPath = req.file.path;
    }

    // Create and save the new category
    const newCategory = new Category({ title, description, imgPath });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully, " + imgPath, newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error while saving category" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    // Aggregate categories with the count of products
    const categoriesWithProductCounts = await Category.aggregate([
      {
        $lookup: {
          from: 'products', // The name of your products collection
          localField: '_id',
          foreignField: 'categoryId',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          imgPath: 1,
          productCount: 1,
          createdAt: 1 // Include the creation date
        }
      }
    ]);

    res.status(200).json(categoriesWithProductCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    // Query categories and select only _id and title fields
    const categories = await Category.find({}, 'title'); // Only fetch title, _id is included by default

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single category by ID
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { title, description } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the new title already exists (excluding the current category)
    if (title && title !== category.title) {
      const existingCategory = await Category.findOne({ title });
      if (existingCategory) {
        return res.status(400).json({ message: "Error while updating category" });
      }
    }

    let imgPath = category.imgPath;

    // If there's a new image uploaded, delete the old one and update the imgPath
    if (req.file) {
      if (category.imgPath) {
        const publicId = category.imgPath.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId); // Delete old image from Cloudinary
      }
      imgPath = req.file.path; // Cloudinary secure_url set by multer storage
    }

    // Update category properties
    category.title = title || category.title;
    category.description = description || category.description;
    category.imgPath = imgPath;

    await category.save();

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.imgPath) {
      const publicId = category.imgPath.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.updateMany({ categoryId: category._id }, { $set: { categoryId: null } });

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategories = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const categories = await Category.find({ _id: { $in: ids } });

    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    for (const category of categories) {
      if (category.imgPath) {
        const publicId = category.imgPath.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      await Product.updateMany({ categoryId: category._id }, { $set: { categoryId: null } });
    }

    await Category.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Categories deleted successfully" });
  } catch (error) {
    console.error("Error deleting categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};