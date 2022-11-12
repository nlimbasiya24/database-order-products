import { Shopify } from "@shopify/shopify-api";


export async function storeAppUninstallWebhook(session) {
 
  const { Webhook } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  try {
    const webhookAppUninstall = new Webhook({ session });
    webhookAppUninstall.address = "pubsub://trytowish-363814:appUninstall";
    webhookAppUninstall.topic = "app/uninstalled";
    webhookAppUninstall.format = "json";
    await webhookAppUninstall.save({
      update: true,
    });
    console.log(`Webhook processed, returned status code 200`);
  } catch (e) {
    console.log(`Failed to process webhook: ${e.message}`);
  }
 
}
