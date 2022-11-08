import mongoose from "mongoose";

const appHistory = new mongoose.Schema({
  shop: String,
  isActive: Boolean,
  history: [{}]
});

export const AppHistorySchema = mongoose.model("app-history", appHistory);
