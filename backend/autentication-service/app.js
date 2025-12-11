var express = require("express");
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var logger = require("morgan");
var cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Rotas
const authRoutes = require("./routes/auths");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth Service conectado ao MongoDB.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectDB();

const app = express();

// --- Middlewares Comuns ---
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rota de saúde (Health Check)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Auth Service está rodando!",
    status: "OK",
  });
});

// Montagem do roteador de autenticação
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Auth Service escutando na porta ${PORT}`);
});

module.exports = app;