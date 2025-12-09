const Product = require("../models/product");
const Restaurant = require("../models/restaurant");

// --- Leitura (Read) ---

// @desc    Busca e filtra produtos no catálogo, com validação de filtros
// @route   GET /api/v1/products?name=...&category=...&restaurant=...&isAvailable=...
// @access  Public
exports.searchProducts = async (req, res) => {
  const allowedFilters = ["name", "category", "restaurant", "isAvailable"];
  const queryKeys = Object.keys(req.query);

  const invalidFilters = queryKeys.filter(
    (key) => !allowedFilters.includes(key)
  );
  if (invalidFilters.length > 0) {
    return res.status(400).json({
      success: false,
      message: `❌ Filtros inválidos detectados: ${invalidFilters.join(
        ", "
      )}. Parâmetros permitidos são: ${allowedFilters.join(", ")}.`,
    });
  }

  try {
    const { name, category, restaurant, isAvailable } = req.query;
    const filter = {};

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable.toLowerCase() === "true";
    }

    if (restaurant) filter.restaurant = restaurant;
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .populate("restaurant", "name")
      .sort("name");

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de recurso inválido no filtro." });
    }

    return res.status(500).json({
      success: false,
      message: "Erro do servidor ao buscar produtos.",
      error: error.message,
    });
  }
};

// --- Criação (Create) ---

// @desc    Adiciona um novo produto a um restaurante
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurante associado não encontrado.",
      });
    }

    const product = await Product.create(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    if (error.code && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `O campo '${field}' deve ser único. O valor fornecido já existe.`,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID de restaurante fornecido é inválido.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao criar produto.",
      error: error.message,
    });
  }
};

// --- Atualização (Update) ---

// @desc    Atualiza um produto existente
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "description",
      "price",
      "category",
      "isAvailable",
    ];

    const validatedBody = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        validatedBody[key] = req.body[key];
      }
    });

    if (Object.keys(validatedBody).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Nenhum campo válido fornecido para atualização. Campos permitidos: " +
          allowedUpdates.join(", "),
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      validatedBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produto não encontrado." });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de produto inválido." });
    }

    return res.status(500).json({
      success: false,
      message: "Erro interno ao atualizar produto.",
      error: error.message,
    });
  }
};

// --- Exclusão (Delete) ---

// @desc    Exclui um produto
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produto não encontrado." });
    }

    return res.status(204).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de produto inválido." });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao excluir produto.",
      error: error.message,
    });
  }
};
