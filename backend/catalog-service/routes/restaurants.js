const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantDetails,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

// Rotas públicas de leitura (Read)
router.get("/", getAllRestaurants); // GET /api/v1/restaurants
router.get("/:id", getRestaurantDetails); // GET /api/v1/restaurants/:id

// Rotas privadas de escrita (Create, Update, Delete)
// **NOTA:** Em uma aplicação real, estas rotas teriam um middleware de autenticação (ex: authMiddleware)
router.post("/", createRestaurant); // POST /api/v1/restaurants
router.put("/:id", updateRestaurant); // PUT /api/v1/restaurants/:id
router.delete("/:id", deleteRestaurant); // DELETE /api/v1/restaurants/:id

module.exports = router;
