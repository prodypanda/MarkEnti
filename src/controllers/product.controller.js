const Product = require('../models/product.model')
const { applyActiveDiscount } = require('../utils/productUtils')

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      variations,
      inventoryCount = 0,
    } = req.body
    let product = new Product({
      name,
      slug,
      description,
      price,
      category,
      variations,
      inventoryCount,
    })
    product = await product.save()
    return res.status(201).json(product)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })
    return res.status(200).json(product)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Product removed' })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.getProducts = async (req, res) => {
  try {
    const { start, end } = req.query // Extract start and end from query parameters

    // Convert start and end to numbers and calculate limit
    const startIndex = parseInt(start, 10) || 0 // Default to 0 if not provided
    const endIndex = parseInt(end, 10)
    const limit = endIndex ? endIndex - startIndex + 1 : undefined // Calculate limit based on end and start

    // Count the total number of categories
    const totalCount = await Product.countDocuments({}) // You can add any specific filters if necessary

    // Find products with optional pagination
    let products = await Product.find()
      .populate('category')
      .skip(startIndex)
      .limit(limit)

    // Applying discounts in parallel using Promise.all
    // products = await Promise.all(
    //   products.map(async (product) => {
    //     return applyActiveDiscount(product);
    //   })
    // );

    // Set the x-total-count header with the total count
    res.setHeader('x-total-count', totalCount.toString())
    // Sending the response with the selected range of products
    return res.status(200).json(products)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// exports.getProducts = async (req, res) => {
//   try {
//     // Fetching the page number and limit from request query
//     // Setting default to page 1 and limit to 10 if not provided
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     // Calculating the number of documents to skip
//     const skip = (page - 1) * limit;

//     // First, find the count of all products for pagination meta
//     const total = await Product.countDocuments();

//     // Fetching the products with pagination
//     // Using skip and limit for pagination
//     let products = await Product.find()
//       .populate('category')
//       .skip(skip)
//       .limit(limit);

//     // Applying active discounts to each product
//     products = await Promise.all(
//       products.map(async (product) => {
//         return applyActiveDiscount(product);
//       })
//     );

//     // Preparing the pagination result
//     const result = {
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       limit: limit,
//       totalItems: total,
//       data: products,
//     };

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id).populate('category')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const { product: discountedProduct, discount } =
      await applyActiveDiscount(product)
    return res.status(200).json({ product: discountedProduct, discount })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Route to get product by ID or Slug
exports.getProductByIdOrSlug = async (req, res) => {
  let identifier = req.params.identifier
  try {
    let product = await Product.findOne({
      $or: [{ _id: identifier }, { slug: identifier }],
    })

    if (product) {
      return res.status(200).json(product)
    } else {
      return res.status(404).send('Product not found')
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
