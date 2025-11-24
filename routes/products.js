const express = require("express");
const router = express.Router();
const {
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Rota pública de busca e filtro (Read)
router.get("/", searchProducts); // GET /api/v1/products?query...

// Rotas privadas de escrita (Create, Update, Delete)
// **NOTA:** Em uma aplicação real, estas rotas teriam um middleware de autenticação
router.post("/", createProduct); // POST /api/v1/products
router.put("/:id", updateProduct); // PUT /api/v1/products/:id
router.delete("/:id", deleteProduct); // DELETE /api/v1/products/:id

module.exports = router;
