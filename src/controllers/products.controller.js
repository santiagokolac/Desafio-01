import Product from "../dao/models/Product.js";

export const getAllProducts = async (req, res) => {
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

    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.page - 1 : null,
      nextPage: products.hasNextPage ? products.page + 1 : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?limit=${limit}&page=${
            products.page - 1
          }&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?limit=${limit}&page=${
            products.page + 1
          }&sort=${sort}&query=${query}`
        : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
