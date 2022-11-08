import mongoose from "mongoose";

const OrderData = new mongoose.Schema({
  shop: String,
  order_Id: String,
});

export const orderSchema = mongoose.model("orderdata", OrderData);
