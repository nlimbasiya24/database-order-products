import { Shopify } from "@shopify/shopify-api";
import { ProductSchema } from "../database/productData.js";
import { orderSchema } from "../database/orderData.js";
import express from "express";
import { AppInstallations } from "../app_installations.js";



export async function storeOrderProduct(session) {

  const { Product } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`);
  const { Order } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`);
  const { Webhook } = await import(`@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`);
try{
  const webhookAppUninstall = new Webhook({ session });
   webhookAppUninstall.address = "pubsub://trytowish-363814:appUninstall";
   webhookAppUninstall.topic = "app/uninstalled";
   webhookAppUninstall.format = "json";
   await webhookAppUninstall.save({
     update: true,
   });

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
   console.log(`Webhook processed, returned status code 200`);
}catch(e){
  console.log(`Failed to process webhook: ${e.message}`);

}
  const allProductsSave = await Product.all({ session,limit:250 });
  const allOrderSave = await Order.all({ session, status: "any" });

  allProductsSave.map(async (productData) => {
    let ProductDataStore = new ProductSchema();
    ProductDataStore.shop = session.shop;
    ProductDataStore.product_Id = productData.id;
    ProductDataStore.product_name = productData.title;
    await ProductDataStore.save();
   
  });

  allOrderSave.map(async (orderdata) => {
    let OrderDataStore = new orderSchema();
    OrderDataStore.shop = session.shop;
    OrderDataStore.order_Id = orderdata.id;
    await OrderDataStore.save();
  });

}

export const productsAndOrders=express.Router();

productsAndOrders.post("/productCreate", async (req, res) => {
   const messageProductCreate = await req.body ? req.body.message : null;
   if (messageProductCreate) {
      const bufferProductCreate = Buffer.from(messageProductCreate.data, "base64");
      const dataProductCreate = bufferProductCreate ? bufferProductCreate.toString() : null;

      console.log(`Received message ${messageProductCreate.messageId}:`); 
      console.log(`Received message ${messageProductCreate.attributes}:`);
      console.log(`Data: ${dataProductCreate}`);
    }
   return res.send(204);
  });

productsAndOrders.post("/productDelete", async (req, res) => {
    const messageProductDelete = (await req.body) ? req.body.message : null;
    if (messageProductDelete) {
      const bufferProductDelete = Buffer.from(messageProductDelete.data,"base64");
      const dataProductDelete = bufferProductDelete?bufferProductDelete.toString(): null;
      await ProductSchema.findOneAndDelete({product_Id: JSON.parse(dataProductDelete).id.toString(),shop: messageProductDelete.attributes["X-Shopify-Shop-Domain"]})
          .then((success) => console.log("success",success))
          .catch((err) => console.log("error", err))
     }
     return res.sendStatus(204);
  });

productsAndOrders.post("/productUpdate", async (req, res) => {
      const messageProductUpdate = (await req.body) ? req.body.message : null;
      if (messageProductUpdate) {
        const bufferProductUpdate = Buffer.from(
          messageProductUpdate.data,
          "base64"
        );
        const dataProductUpdate = bufferProductUpdate
          ? bufferProductUpdate.toString()
          : null;

        console.log(`Received message ${messageProductUpdate.messageId}:`);
        console.log(`Data: ${dataProductUpdate}`);
      }

      return res.send(204);
  });

productsAndOrders.post("/appUninstall", async (req, res) => {
      const appUnistall = (await req.body) ? req.body.message : null;
     try {
        await ProductSchema.deleteMany({shop: appUnistall.attributes["X-Shopify-Shop-Domain"]});
        await AppInstallations.delete(appUnistall.attributes["X-Shopify-Shop-Domain"]);
        console.log("App uninstall sucessfully")
        return res.sendStatus(204);
      }
      catch(e){
        console.log("Someting went wrong",e.message);
      }
    
    });





