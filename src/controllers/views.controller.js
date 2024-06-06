import Cart from "../dao/models/Cart.js";
import Product from "../dao/models/Product.js";

export const getProductsView = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query
      ? { $or: [{ category: query }, { available: query }] }
      : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    const products = await Product.paginate(filter, options);

    res.render("products", {
      products: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.page - 1 : null,
      nextPage: products.hasNextPage ? products.page + 1 : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getCartView = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
