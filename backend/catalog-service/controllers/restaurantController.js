const Restaurant = require("../models/restaurant");
const Product = require("../models/product");

// --- Leitura (Read) ---

// @desc    Busca todos os restaurantes (abertos ou fechados),
//          permitindo filtro opcional 'isOpen' e validação estrita de query params.
// @route   GET /api/v1/restaurants
// @access  Public
exports.getAllRestaurants = async (req, res) => {
  const allowedFilters = ["isOpen"];
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

  let filter = {};
  if (req.query.isOpen !== undefined) {
    filter.isOpen = req.query.isOpen.toLowerCase() === "true";
  }

  try {
    const restaurants = await Restaurant.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro do servidor ao buscar restaurantes.",
      error: error.message,
    });
  }
};

// @desc    Busca detalhes de um restaurante específico e seu menu
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurante não encontrado.",
      });
    }

    const menu = await Product.find({
      restaurant: req.params.id,
      isAvailable: true,
    }).select("-restaurant");

    res.status(200).json({
      success: true,
      data: {
        restaurantDetails: restaurant,
        menu: menu,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de restaurante inválido." });
    }

    res.status(500).json({
      success: false,
      message: "Erro do servidor ao buscar detalhes.",
      error: error.message,
    });
  }
};

// --- Criação (Create) ---

// @desc    Cria um novo restaurante
// @route   POST /api/v1/restaurants
// @access  Private (Deve ser protegido por autenticação de Admin)
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
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

    res.status(500).json({
      success: false,
      message: "Erro interno ao criar restaurante.",
      error: error.message,
    });
  }
};

// --- Atualização (Update) ---

// @desc    Atualiza um restaurante existente de forma segura
// @route   PUT /api/v1/restaurants/:id
// @access  Private
exports.updateRestaurant = async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "address",
      "cuisineType",
      "estimatedDeliveryTime",
      "isOpen",
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

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      validatedBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurante não encontrado." });
    }

    res.status(200).json({ success: true, data: restaurant });
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
        .json({ success: false, message: "ID de restaurante inválido." });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno ao atualizar restaurante.",
      error: error.message,
    });
  }
};

// --- Exclusão (Delete) ---

// @desc    Exclui um restaurante
// @route   DELETE /api/v1/restaurants/:id
// @access  Private
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurante não encontrado." });
    }

    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "ID de restaurante inválido." });
    }
    res.status(500).json({
      success: false,
      message: "Erro ao excluir restaurante.",
      error: error.message,
    });
  }
};
