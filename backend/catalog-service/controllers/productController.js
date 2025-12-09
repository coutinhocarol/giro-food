const Product = require("../models/product");
const Restaurant = require("../models/restaurant");

// --- Leitura e Filtro (Read) ---

// @desc    Busca e filtra produtos no catálogo, com validação de filtros
// @route   GET /api/v1/products?name=...&category=...&restaurantId=...&isAvailable=...
// @access  Public
exports.searchProducts = async (req, res) => {
  const allowedFilters = ["name", "category", "restaurantId", "isAvailable"];
  const queryKeys = Object.keys(req.query);

  // Validação estrita de query params (Padrão: getAllRestaurants)
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
    const { name, category, restaurantId, isAvailable } = req.query;
    const filter = {};

    // O campo isAvailable é importante, permitindo que o admin veja indisponíveis,
    // mas o público geral deve ver apenas os disponíveis. Por padrão, não filtramos aqui
    // para dar flexibilidade, mas o frontend pode passar explicitamente.
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable.toLowerCase() === "true";
    }

    if (restaurantId) filter.restaurant = restaurantId;
    // $regex para busca parcial e $options: "i" para case-insensitive
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;

    const products = await Product.find(filter)
      // Popula o campo 'restaurant' para mostrar nome e tipo de cozinha
      .populate("restaurant", "name cuisineType")
      .sort("name");

    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    // Tratamento de CastError (Se o restaurantId ou outro ID for inválido)
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de recurso inválido no filtro." });
    }
    res.status(500).json({
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
    const { restaurant } = req.body;

    // 1. Verifica se o ID do restaurante é válido e existe (Boa Prática)
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({
        success: false,
        message: "Restaurante associado não encontrado.",
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    // Tratamento de Erro de Validação de Schema (400)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }

    // Tratamento de Erro de Chave Duplicada (400 - Padrão: createRestaurant)
    if (error.code && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `O campo '${field}' deve ser único. O valor fornecido já existe.`,
      });
    }

    // Tratamento de CastError (se o ID do restaurante no body for inválido)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID de restaurante fornecido é inválido.",
      });
    }

    // Erro Interno (500)
    res.status(500).json({
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
    // 1. LISTA DE CAMPOS PERMITIDOS (Whitelisting - Ajuste para seu Schema)
    const allowedUpdates = [
      "name",
      "description",
      "price",
      "category",
      "isAvailable",
    ];

    const validatedBody = {};

    // 2. FILTRAGEM DE CAMPOS (Padrão: updateRestaurant)
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        validatedBody[key] = req.body[key];
      }
    });

    // 3. Verificação de Campos Válidos
    if (Object.keys(validatedBody).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Nenhum campo válido fornecido para atualização. Campos permitidos: " +
          allowedUpdates.join(", "),
      });
    }

    // 4. Execução da Atualização Segura
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

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    // 5. Tratamento de Erros (Padrão)
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
    res.status(500).json({
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

    // Retorna 204 No Content (Padrão: deleteRestaurant)
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de produto inválido." });
    }
    res.status(500).json({
      success: false,
      message: "Erro ao excluir produto.",
      error: error.message,
    });
  }
};
