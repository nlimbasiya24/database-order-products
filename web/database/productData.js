import mongoose from "mongoose";

const ProductsIDandTitle = new mongoose.Schema({
  shop: String,
  product_Id: String,
  product_name: String,
});

export const ProductSchema = mongoose.model(
  "productdata",
  ProductsIDandTitle
);
