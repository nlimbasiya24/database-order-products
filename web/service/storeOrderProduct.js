import { Shopify } from "@shopify/shopify-api";
import { ProductSchema } from "../database/productData.js";
import { orderSchema } from "../database/orderData.js";
import { PubSub } from "@google-cloud/pubsub";
import express from "express";
import path from "path";
import { OAuth2Client } from "google-auth-library";
import process from "process";


export async function storeOrderProduct(session) {
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const { Order } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const { Webhook } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const webhookProductUpdate = new Webhook({ session });
  webhookProductUpdate.address = "pubsub://trytowish-363814:productUpdate";
  webhookProductUpdate.topic = "products/update";
  webhookProductUpdate.format = "json";
  await webhookProductUpdate.save({
    update: true,
  });
  const webhookProductCreate = new Webhook({ session });
  webhookProductCreate.address = "pubsub://trytowish-363814:productCreate";
  webhookProductCreate.topic = "products/create";
  webhookProductCreate.format = "json";
  await webhookProductCreate.save({
    update: true,
  });
  const webhookProductDelete = new Webhook({ session });
  webhookProductDelete.address = "pubsub://trytowish-363814:productDelete";
  webhookProductDelete.topic = "products/delete";
  webhookProductDelete.format = "json";
  await webhookProductDelete.save({
    update: true,
  });

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

  allOrderSave.map(async (orderdata) => {
    let OrderDataStore = new orderSchema();
    OrderDataStore.shop = session.shop;
    OrderDataStore.order_Id = orderdata.id;
    await OrderDataStore.save();
  });

}

export const productsAndOrders=express.Router();
productsAndOrders.post("/google-cloud-pubsub-subscriber", (req, res) => {

    const message = req.body ? req.body.message : null;
   if (message) {
      const buffer = Buffer.from(message.data, "base64");
      const data = buffer ? buffer.toString() : null;

      console.log(`Received message ${message.messageId}:`);
      console.log(`Data: ${data}`);
    }

    return res.send(204);
  });





