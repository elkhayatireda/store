import Product from "../models/product.model.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // const { productTitle, variants, combinations } = req.body;
    const imageFiles = req.files;

    // Process your form data and save it to the database
    // Here, you can associate the image files with their corresponding combinations
    imageFiles.forEach((combination, index) => {
        const imageFile = imageFiles[index];
        console.log(imageFile.path);
    });

 
 
    res.status(201);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while saving the product' });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { title, comparePrice, price, url, images, description, variants } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.title = title || product.title;
    product.comparePrice = comparePrice || product.comparePrice;
    product.price = price || product.price;
    product.url = url || product.url;
    product.images = images || product.images;
    product.description = description || product.description;
    product.variants = variants || product.variants;
    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
