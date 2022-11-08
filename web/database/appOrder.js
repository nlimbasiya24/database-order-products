import mongoose from "mongoose";

const AppSubscription = new mongoose.Schema({
  shop: String,
  admin_graphql_api_id: String,
  name: String,
  status: String,
  admin_graphql_api_shop_id: String,
  created_at: Date,
  updated_at: Date
});

export const AppSubscriptionSchema = mongoose.model("app_subscription", AppSubscription);
