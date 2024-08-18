import Product from '../models/product.model.js';
import Variant from '../models/variant.model.js';
import Combination from '../models/combination.model.js';
import Category from "../models/category.model.js";
// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { 
        categoryId, 
        title, 
        description, 
        isVariant, 
        comparePrice,
        price,
        differentPrice,
        visible,
    } = req.body;
    const  variants =  JSON.parse(req.body.variants);
    const  combinations =  JSON.parse(req.body.combinations);
    const imageFiles = req.files;

    // let images = [];
    // imageFiles.forEach((combination, index) => { 
    //     const imageFile = imageFiles[index];
    //     images.push(imageFile.path);
    // });
    const images = await Promise.all(imageFiles.map(async (imageFile, index) => {
      const imagePath = imageFile.path; 
      return imagePath;
    }));
  
    const url = await generateSlug(title);

    let category = await Category.findById(categoryId); 
    let newProduct = new Product({
        categoryId: category,
        title,
        comparePrice,
        price,
        differentPrice,
        url,
        images,
        visible,
        description,
        isVariant,
    });
  
    if (isVariant) {
      const variantDocs = await Promise.all(variants.map(variant => {
        const newVariant = new Variant({
          product: newProduct._id,
          name: variant.variantName,
          values: variant.values,
        });
        return newVariant.save();
      }));
    
      const combinationDocs = await Promise.all(combinations.map(combination => {
        const variantValues = variantDocs.map(variantDoc => variantDoc._id);
        combination.variantIndices.forEach((elem) => {
          elem.variantIndex = variantValues[elem.variantIndex];
        });
        const newCombination = new Combination({
          product: newProduct._id,
          combination: combination.combination,
          variantValues: combination.variantIndices,
          price: combination.price,
          comparePrice: combination.comparePrice,
          image: images[combination.img],
        });
        return newCombination.save();
      }));
    
      newProduct.variants = variantDocs.map(variantDoc => variantDoc._id);
      newProduct.combinations = combinationDocs.map(combinationDoc => combinationDoc._id);
      await newProduct.save();
    }
    
    res.status(201).json(newProduct);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
}
};
const generateSlug = async (title) => {
  let url = title.trim().toLowerCase().replace(/\s+/g, '-');
  let slugExists = await Product.findOne({ slug: url });
  while (slugExists) {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    url = `${url}-${randomNumbers}`;
    slugExists = await Product.findOne({ slug: url });
  }
  return url;
};
// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId');
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
