const productModel = require('../models/productModel');

async function createProduct(req, res) {
  try {
    const { name, price, image_url } = req.body || {};
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    const product = await productModel.createProduct({
      name,
      price: parsedPrice,
      image_url: image_url || null,
      user_id: req.user.id,
    });

    return res.status(201).json({ product });
  } catch (err) {
    console.error('Create product error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function listProducts(req, res) {
  try {
    const products = await productModel.listProductsWithSeller();
    return res.status(200).json({ products });
  } catch (err) {
    console.error('List products error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.getProductWithSellerById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product });
  } catch (err) {
    console.error('Get product error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createProduct, listProducts, getProduct };