const Product = require('../models/Product');

const productController = {
  addProduct: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { details, category, price, stock } = req.body;

      // Create a new product
      const newProduct = new Product({ details, category, price, stock });

      // Save the product to the database
      await newProduct.save();

      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Get total number of products for pagination info
      const totalProducts = await Product.countDocuments();

      // Get paginated products
      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .exec();

      res.status(200).json({
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;

      // Find the product by ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  editProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const { details, category, price, stock } = req.body;

      // Find the product by ID
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Update product details
      product.details = details;
      product.category = category;
      product.price = price;
      product.stock = stock;

      // Save the updated product to the database
      await product.save();

      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      // Find the product by ID and remove it
      const result = await Product.findByIdAndRemove(productId);

      if (!result) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = productController;
