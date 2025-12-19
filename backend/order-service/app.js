var express = require("express");
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
const authMiddleware = require("./middlewares/auth");

// Load environment variables
dotenv.config();

// Routes
const ordersRouter = require("./routes/orders");
require('./events/orderSubscriber');

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
      message: "O serviço de Pedidos está temporariamente indisponível.",
      error: error.message,
    });
  }
  next();
}

// Listeners para eventos de conexão
mongoose.connection.on("disconnected", () => {
  console.log("Order Service: MongoDB disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("Order Service: MongoDB connection error:", err.message);
});

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- Middlewares Comuns ---
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkMongoConnection);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Order Service está rodando!",
    status: "OK",
  });
});

app.use(authMiddleware);

app.use("/api/v1/orders", ordersRouter);

module.exports = app;