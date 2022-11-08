import { Shopify} from "@shopify/shopify-api";
import express from "express";

  const app = express();

export async function storeOrderProduct(session) {


  // console.log("Session",session)

  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const { Order } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const allProductsSave = await Product.all({ session });
  const allOrderSave = await Order.all({
    session,
    status: "any",
  });
  const productArr = allProductsSave.map((productData) => {
    const finalProductData = {
      id: productData.id,
      title: productData.title,
    };
    return finalProductData;
  });
  const orderArr = allOrderSave.map((orderData) => {
    const finalOrderData = { id: orderData.id };
    return finalOrderData;
  });
  console.log("productArr", productArr);
  console.log("OrderArr", orderArr);
}
