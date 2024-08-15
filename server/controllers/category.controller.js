import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  const { title, description } = req.body;
  try {
    let imgPath = null;
    if (req.file) {
      imgPath = req.file.path;
    }

    const newCategory = new Category({ title, description, imgPath });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully, " + imgPath, newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
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

    let imgPath = category.imgPath;
    if (req.file) {
      if (category.imgPath) {
        const publicId = category.imgPath.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      imgPath = result.secure_url;
    }

    category.title = title || category.title;
    category.description = description || category.description;
    category.imgPath = imgPath || category.imgPath;
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
