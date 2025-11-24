const mongoose = require("mongoose");
const normalize = require("normalize-mongoose").default;

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do restaurante é obrigatório."],
      trim: true,
      unique: true,
    },
    address: {
      type: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
      },
      required: true,
    },
    cuisineType: {
      type: String,
      required: true,
      enum: [
        "Italiana",
        "Japonesa",
        "Brasileira",
        "Mexicana",
        "Vegetariana",
        "Hamburgueria",
        "Outra",
      ],
    },
    estimatedDeliveryTime: {
      type: Number, // em minutos
      required: true,
      min: [5, "O tempo estimado mínimo é 5 minutos"],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.plugin(normalize);

module.exports = mongoose.model("Restaurant", restaurantSchema);
