import { Shopify } from "@shopify/shopify-api";
import { ProductSchema } from "../database/productData.js";

export async function storeProductWebhook(session) {
  const { Webhook } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  try {
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
  } catch (e) {
    console.log(`Failed to process webhook: ${e.message}`);
  }
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  let productsData = await client.get({
    path: "products",
    query: { limit: 250 },
  });
  let getProductsOnecall = productsData.body.products;
  while(getProductsOnecall.length!==0){
        getProductsOnecall?.map(async (productData) => {
        let ProductDataStore = new ProductSchema();
        ProductDataStore.shop = session.shop;
        ProductDataStore.product_Id = productData.id;
        ProductDataStore.product_name = productData.title;
        await ProductDataStore.save()
              .then(() => console.log(`Product Save Successfully`))
              .catch((err) =>
                console.log("Server err from mongodb product is not saved", err)
              );
        });
        if(productsData.pageInfo.nextPage){
            productsData = await client.get({
                path: "products",
                query: {
                  limit: 250,
                  page_info: productsData.pageInfo.nextPage.query.page_info
                },
              });
              getProductsOnecall = productsData.body.products;
        }else{
                break;
        }
 }
  console.log("********************************");
}
