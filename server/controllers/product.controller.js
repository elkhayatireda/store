import Product from '../models/product.model.js';
import Variant from '../models/variant.model.js';
import Combination from '../models/combination.model.js';
import Category from "../models/category.model.js";
import cloudinary from '../config/cloudinaryConfig.js';
import Order from '../models/order.model.js';

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
    const variants = JSON.parse(req.body.variants);
    const combinations = JSON.parse(req.body.combinations);
    const imageFiles = req.files;

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
          image: images[combination.img] || '',
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
    const products = await Product.find()
      .populate('categoryId', '_id title') // Populate categoryId with _id and title fields
      .select('categoryId title price images visible createdAt'); // Select only the desired fields

    // Count orders for each product
    const productsWithOrderCount = await Promise.all(
      products.map(async (product) => {
        // Use aggregation to count the total quantity of the product in all orders
        const orderCount = await Order.aggregate([
          { $unwind: "$items" }, // Deconstruct the items array
          { $match: { "items.id": product._id.toString() } }, // Match the product ID in items array
          { $group: { _id: "$items.id", totalQuantity: { $sum: "$items.quantity" } } } // Sum the quantity of this product
        ]);

        // If the product is found in orders, retrieve the total quantity
        const count = orderCount.length > 0 ? orderCount[0].totalQuantity : 0;

        return {
          ...product.toObject(),
          orderCount: count,
        };
      })
    );

    res.status(200).json(productsWithOrderCount);
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


// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Variant.deleteMany({ product: req.params.id });

    // Delete associated combinations
    await Combination.deleteMany({ product: req.params.id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductsAndCombinations = async (req, res) => {
  try {
    // Fetch all products and populate the categoryId field
    const products = await Product.find().populate('categoryId');

    // Iterate over each product to check if it's a variant
    const productsWithCombinations = await Promise.all(
      products.map(async (product) => {
        if (product.isVariant) {
          // Fetch combinations for the product
          const combinations = await Combination.find({ product: product._id });

          // Return the product with its combinations
          return {
            ...product.toObject(),
            combinations,
          };
        } else {
          // If no variants, return the product as is
          return product.toObject();
        }
      })
    );

    res.status(200).json(productsWithCombinations);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteProducts = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const products = await Product.find({ _id: { $in: ids } });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    for (const product of products) {
      if (product.images && Array.isArray(product.images)) {
        for (const imagePath of product.images) {
          const publicId = imagePath.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

    }

    await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Products deleted successfully" });
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const visibility = product.visible;
    product.visible = !visibility;
    product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getvariants = async (req, res) => {
  try {
    const { id } = req.params;
    const variants = await Variant.find({ product: id }).lean();
    if (!variants) {
      return res.status(404).json({ message: 'Variants not found' });
    }
    res.status(200).json(variants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch variants' });
  }
};
export const getCombinations = async (req, res) => {
  try {
    const { id } = req.params;
    const combinations = await Combination.find({ product: id }).lean();
    if (!combinations) {
      return res.status(404).json({ message: 'Combinations not found' });
    }
    res.status(200).json(combinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch combinations' });
  }
};


export const uploadImages = async (req, res) => {
  try {
    const imageFiles = req.files;
    const images = await Promise.all(imageFiles.map(async (imageFile, index) => {
      const imagePath = imageFile.path;
      return imagePath;
    }));

    res.status(201).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};
export const deleteImages = async (req, res) => {
  try {
    const images = req.body.images;
    console.log(images)
    const publicId = images.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId); // Delete image from Cloudinary
    res.status(200).json({ message: 'Images deleted successfully' });
  } catch (error) {
    console.error('Failed to delete images:', error);
    res.status(500).json({ error: 'Failed to delete images' });
  }
};
export const updateImages = async (req, res) => {
  try {
    const images = req.body.images;
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(images)
    product.images = images;
    console.log(product.images)
    await product.save();
    await Promise.all(
      product.images.map(async (image) => {
        const combinations = await Combination.find({ product: product._id });

        if (combinations.length === 0) {
          res.status(200).json({ message: 'Images deleted successfully' });

        }

        return Promise.all(
          combinations.map(async (combination) => {
            if (!images.includes(combination.image)) {
              console.log('jkkkdf')
              return Combination.findOneAndUpdate(
                { _id: combination._id },
                { image: '' },
                { new: true }
              );
            }
          })
        );
      })
    );

    res.status(200).json({ message: 'Images deleted successfully' });
  } catch (error) {
    console.error('Failed to delete images:', error);
    res.status(500).json({ error: 'Failed to delete images' });
  }
};


export const updateProduct = async (req, res) => {
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
      imagesChanged,
      variantsChanged,
      combImage,
      combination,
    } = req.body;
    const productId = req.params.id;
    const product = Product.findById(productId)
    const updatedData = {
      visible: visible,
      differentPrice: differentPrice,
      isVariant: isVariant,
      title: title,
      price: price,
      description,
      categoryId,
      comparePrice: comparePrice,
    };
    console.log("variant ", isVariant)
    const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, updatedData, { new: true });
    if (variantsChanged == 'true') {
      const parsedVariants = JSON.parse(req.body.variants);
      await Variant.deleteMany({ product: productId });
      await Combination.deleteMany({ product: productId });
      if (parsedVariants.length > 0) {
        console.log('yesdd');
        const parsedCombinations = JSON.parse(req.body.combinations);
        const variantDocs = await Promise.all(parsedVariants.map(variant => {
          const newVariant = new Variant({
            product: productId,
            name: variant.variantName,
            values: variant.values,
          });
          return newVariant.save();
        }));
        console.log('l3ew')
        // Create new combinations
        const combinationDocs = await Promise.all(parsedCombinations.map(combination => {
          const variantValues = variantDocs.map(variantDoc => variantDoc._id);
          combination.variantIndices.forEach((elem) => {
            elem.variantIndex = variantValues[elem.variantIndex];
          });
          const newCombination = new Combination({
            product: productId,
            combination: combination.combination,
            variantValues: combination.variantIndices,
            price: combination.price,
            comparePrice: combination.comparePrice,
            image: combination.img,
          });
          return newCombination.save();
        }));
      }

    } else if (combination == 'true') {
      console.log('yesssss');
      const combinations = JSON.parse(req.body.combinations);
      await Promise.all(combinations.map(async combination => {
        return Combination.findByIdAndUpdate(combination._id, { price: combination.price, comparePrice: combination.comparePrice }, { new: true });
      }));
    } else if (combImage == 'true') {
      console.log('yes');
      const combinations = JSON.parse(req.body.combinations);
      await Promise.all(combinations.map(async combination => {
        return Combination.findByIdAndUpdate(combination._id, { image: combination.img }, { new: true });
      }));
    }
    console.log(combImage)
    res.status(200).json({ message: 'Product updated successfully' });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    // Step 1: Aggregate order items to get the count of each product ID
    const productCounts = await Order.aggregate([
      { $unwind: "$items" }, // Unwind the items array to get individual products
      { $group: { _id: "$items.id", count: { $sum: "$items.quantity" } } }, // Group by product ID and sum the quantities
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 6 } // Limit to top 6 products
    ]);

    // Step 2: Extract product IDs from the aggregation result
    const topProductIds = productCounts.map(item => item._id);

    // Step 3: Find complete product details for the top products
    const topProducts = await Product.find({ _id: { $in: topProductIds } });

    // Return the top products
    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
