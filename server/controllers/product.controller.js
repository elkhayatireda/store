import Product from '../models/product.model.js';
import Variant from '../models/variant.model.js';
import Combination from '../models/combination.model.js';
// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { 
        // categoryId, 
        // title, 
        // comparePrice, 
        // price, 
        // slug,  
        description, 
        isVariant, 
    } = req.body;
      const  variants =  JSON.parse(req.body.variants);
      const  combinations =  JSON.parse(req.body.combinations);

    const imageFiles = req.files;

    let images = [];
    imageFiles.forEach((combination, index) => {
        const imageFile = imageFiles[index];
        images.push(imageFile.path);
    });
    let newProduct = new Product({
        // categoryId,
        // title,
        // comparePrice,
        // price,
        // slug,
        images,
        description,
        isVariant
    });

    if (isVariant) {
        console.log('good')
        newProduct = await newProduct.save();
        // Save each variant 
        const variantDocs = await Promise.all(variants.map(async (variant) => {
            const newVariant = new Variant({
                product: newProduct._id,
                name: variant.variantName,
                values: variant.values
            });
            return await newVariant.save();
        }));

        // Save each combination
        const combinationDocs = await Promise.all(combinations.map(async (combination) => {
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
              image: images[combination.img] // Assuming image is an index
          });
          return await newCombination.save();
      }));
      

        // Update the product with references to variants and combinations
        newProduct.variants = variantDocs.map(variantDoc => variantDoc._id);
        newProduct.combinations = combinationDocs.map(combinationDoc => combinationDoc._id);
        await newProduct.save();

    } else {
        // If the product does not have variants, just save it as is
        newProduct = await newProduct.save();
    }

    res.status(201).json(newProduct);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
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
