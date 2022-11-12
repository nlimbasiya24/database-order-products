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
  const allProductsSave = await Product.all({ session, limit: 250 }).then((success) => console.log("Product get Successfully", success)).catch((err) => console.log("Product is not get Server err from shopify", err));
  const allOrderSave = await Order.all({ session, status: "any" }).then((success) => console.log("Order get Successfully",success)).catch((err) => console.log("Order is not get Server err from shopify",err));

  allProductsSave.map(async (productData) => {
    let ProductDataStore = new ProductSchema();
    ProductDataStore.shop = session.shop;
    ProductDataStore.product_Id = productData.id;
    ProductDataStore.product_name = productData.title;
    await ProductDataStore.save().then((success) => console.log("Product Save Successfully", success)).catch((err) =>console.log("Server err from mongodb product is not saved", err));
  });

  allOrderSave.map(async (orderdata) => {
    let OrderDataStore = new orderSchema();
    OrderDataStore.shop = session.shop;
    OrderDataStore.order_Id = orderdata.id;
    await OrderDataStore.save().then((success)=>console.log("Order Save Successfully",success)).catch((err)=>console.log("Server err from mongodb Order is not saved",err))
  });

}

export const productsAndOrders=express.Router();

productsAndOrders.post("/productCreate", async (req, res) => {

  try{
      const messageProductCreate = await req.body ? req.body.message : null;
      const bufferProductCreate = Buffer.from(messageProductCreate.data, "base64");
      const dataProductCreate = bufferProductCreate ? bufferProductCreate.toString() : null;
       
      let ProductDataStorepubsub = new ProductSchema();
       ProductDataStorepubsub.shop = messageProductCreate.attributes["X-Shopify-Shop-Domain"];  
       ProductDataStorepubsub.product_Id = JSON.parse(dataProductCreate).id.toString();
       ProductDataStorepubsub.product_name=JSON.parse(dataProductCreate).title.toString();
       await ProductDataStorepubsub.save()
        .then((success) => console.log("Product Save Successfully this is google pubsub", success))
        .catch((err) =>
          console.log("Server err from mongodb product is not saved", err)
        );
      return res.sendStatus(204);
    }catch(e){
      console.log("There is a some error in google pubsub")
      return res.sendStatus(400);
    }
   
  });

productsAndOrders.post("/productDelete", async (req, res) => {
    
    try {
      const messageProductDelete = (await req.body) ? req.body.message : null;
      const bufferProductDelete = Buffer.from(messageProductDelete.data,"base64");
      const dataProductDelete = bufferProductDelete?bufferProductDelete.toString(): null;
      await ProductSchema.findOneAndDelete({product_Id: JSON.parse(dataProductDelete).id.toString(),shop: messageProductDelete.attributes["X-Shopify-Shop-Domain"]})
          .then((success) => console.log("product deleting successfully",success))
          .catch((err) => console.log("error in delete product", err))
       return res.sendStatus(204);
        }
      catch(e){
        console.log("Something wrong in pubsub",e.message)
        return res.sendStatus(400);
      }
  
  });

productsAndOrders.post("/productUpdate", async (req, res) => {
  try{
        const messageProductUpdate = (await req.body) ? req.body.message : null;
        const bufferProductUpdate = Buffer.from(messageProductUpdate.data,"base64");
        const dataProductUpdate = bufferProductUpdate? bufferProductUpdate.toString():null;

        await ProductSchema.findOneAndUpdate(
          {
            shop: messageProductUpdate.attributes["X-Shopify-Shop-Domain"],
            product_Id: JSON.parse(dataProductUpdate).id.toString(),
          },
          { product_name: JSON.parse(dataProductUpdate).title.toString()}
        ).then((success)=>console.log("Product Update Successfully",success))
        .catch((err)=>console.log("error in product update",err));
        return res.sendStatus(204);
    }catch(e){
      console.log("There is some error from google pub sub")
      return res.sendStatus(400);
    }
  });

productsAndOrders.post("/appUninstall", async (req, res) => {
      
     try {
        const appUnistall = (await req.body) ? req.body.message : null;
        await ProductSchema.deleteMany({shop: appUnistall.attributes["X-Shopify-Shop-Domain"]});
        await AppInstallations.delete(appUnistall.attributes["X-Shopify-Shop-Domain"]);
        console.log("App uninstall sucessfully")
        return res.sendStatus(204);
      }
      catch(e){
        console.log("Someting went wrong in pubsub",e.message);
        return res.sendStatus(400);
      }
    
    });





