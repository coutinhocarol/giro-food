const mongoose = require("mongoose");
const normalize = require("normalize-mongoose").default;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do produto é obrigatório."],
    },
    description: {
      type: String,
      required: [true, "A descrição é obrigatória."],
    },
    price: {
      type: Number,
      required: [true, "O preço é obrigatório."],
      min: [0, "O preço não pode ser negativo."],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Prato Principal",
        "Bebida",
        "Sobremesa",
        "Acompanhamento",
        "Promoção",
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(normalize);

module.exports = mongoose.model("Product", productSchema);
