import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    Price: Number,
    Category: String,
    image: String,
    embedding: {
    type: [Number],
    default: [],
  },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);