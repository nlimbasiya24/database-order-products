import { Shopify } from "@shopify/shopify-api";
import { ProductSchema } from "../database/productData.js";
import { orderSchema } from "../database/orderData.js";

export async function storeOrderProduct(session) {
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const { Order } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const allProductsSave = await Product.all({ session });
  const allOrderSave = await Order.all({ session, status: "any" });

  allProductsSave.map(async (productData) => {
    let ProductDataStore = new ProductSchema();
    ProductDataStore.shop = session.shop;
    ProductDataStore.product_Id = productData.id;
    ProductDataStore.product_name = productData.title;
    const response = await ProductDataStore.save();
    // console.log("response",response)
  });

  allOrderSave.map(async (orderdata)=>{
    let OrderDataStore=new orderSchema();
    OrderDataStore.shop=session.shop;
    OrderDataStore.order_Id=orderdata.id;
    await OrderDataStore.save();
  })



  
}
