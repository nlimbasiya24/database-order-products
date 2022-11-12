
import { ProductSchema } from "../database/productData.js";
import { orderSchema } from "../database/orderData.js";

export async function AppUninstallPubSubService(appUnistall) {
  await ProductSchema.deleteMany({shop: appUnistall.attributes["X-Shopify-Shop-Domain"]});
   await orderSchema.deleteMany({
     shop: appUnistall.attributes["X-Shopify-Shop-Domain"],
   });
}