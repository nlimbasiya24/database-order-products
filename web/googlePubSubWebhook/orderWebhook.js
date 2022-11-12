import { Shopify } from "@shopify/shopify-api";
import { orderSchema } from "../database/orderData.js";

export async function storeOrderWebhook(session) {

 const { Order } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );
  const { Webhook } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  try {
    const webhookOrderUpdate = new Webhook({ session });
    webhookOrderUpdate.address = "pubsub://trytowish-363814:productUpdate";
    webhookOrderUpdate.topic = "products/update";
    webhookOrderUpdate.format = "json";
    await webhookOrderUpdate.save({
      update: true,
    });

    const webhookProductCreate = new Webhook({ session });
    webhookProductCreate.address = "pubsub://trytowish-363814:productCreate";
    webhookProductCreate.topic = "products/create";
    webhookProductCreate.format = "json";
    await webhookProductCreate.save({
      update: true,
    });
    const webhookOrderDelete = new Webhook({ session });
    webhookOrderDelete.address = "pubsub://trytowish-363814:productDelete";
    webhookOrderDelete.topic = "products/delete";
    webhookOrderDelete.format = "json";
    await webhookOrderDelete.save({
      update: true,
    });
    console.log(`Webhook processed, returned status code 200`);
  } catch (e) {
    console.log(`Failed to process webhook: ${e.message}`);
  }
    const allOrderSave = await Order.all({ session, status: "any" })
    allOrderSave.map(async (orderdata) => {
      let OrderDataStore = new orderSchema();
      OrderDataStore.shop = session.shop;
      OrderDataStore.order_Id = orderdata.id;
      await OrderDataStore.save()
        .then((success) => console.log("Order Save Successfully", success))
        .catch((err) =>
          console.log("Server err from mongodb Order is not saved", err)
        );
    });
}
