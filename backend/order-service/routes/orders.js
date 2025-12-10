const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrder,
  updateOrder,
  cancelOrder
} = require("../controllers/orderController");

const auth = require("../middlewares/auth");

// Rotas protegidas — requer token válido
router.post("/", auth, createOrder);          // POST /api/v1/orders   → criar pedido
router.get("/:id", auth, getOrder);           // GET  /api/v1/orders/:id  → buscar pedido por id
router.put("/:id", auth, updateOrder);        // PUT  /api/v1/orders/:id  → atualizar pedido
router.delete("/:id", auth, cancelOrder);     // DELETE /api/v1/orders/:id → cancelar pedido

module.exports = router;