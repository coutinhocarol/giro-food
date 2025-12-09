var express = require("express");
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// Routes
const productsRouter = require("./routes/products");
const restaurantsRouter = require("./routes/restaurants");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDB();

// --- Middleware global para checar MongoDB ---
function checkMongoConnection(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "O serviço de Catálogo está temporariamente indisponível.",
      error: error.message,
    });
  }
  next();
}

// Listeners para eventos de conexão
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("🔥 MongoDB connection error:", err.message);
});

const app = express();

// --- Middlewares ---
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkMongoConnection);

// Rota de saúde (Health Check)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Catalog Service está rodando!",
    status: "OK",
  });
});

// Montagem dos roteadores separados
app.use("/api/v1/restaurants", restaurantsRouter);
app.use("/api/v1/products", productsRouter);

module.exports = app;
