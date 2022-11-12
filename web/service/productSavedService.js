
import { ProductSchema } from "../database/productData.js";


export async function productCreatePubSubService(messageProductCreate) {

     const dataProductCreate = Buffer.from(messageProductCreate.data,"base64").toString();
     
     let ProductDataStorepubsub = new ProductSchema();
     
     ProductDataStorepubsub.shop =messageProductCreate.attributes["X-Shopify-Shop-Domain"];
     ProductDataStorepubsub.product_Id = JSON.parse(dataProductCreate).id.toString();
     ProductDataStorepubsub.product_name = JSON.parse(dataProductCreate).title.toString();

     await ProductDataStorepubsub.save().then((success) =>
        console.log("Product Save Successfully this is google pubsub", success)
      ).catch((err) =>
        console.log("Server err from mongodb product is not saved", err)
      );
   
  
};

export async function productDeletePubSubService(messageProductDelete) {
 
    const dataProductDelete = Buffer.from(messageProductDelete.data,"base64").toString();
    await ProductSchema.findOneAndDelete({product_Id: JSON.parse(dataProductDelete).id.toString(),shop: messageProductDelete.attributes["X-Shopify-Shop-Domain"]})
      .then((success) => console.log("product deleting successfully", success))
      .catch((err) => console.log("error in delete product", err));
   
  }

export async function productUpdatePubSubService(messageProductUpdate) {
 
    const dataProductUpdate = Buffer.from(messageProductUpdate.data,"base64").toString();
    await ProductSchema.findOneAndUpdate({
        shop: messageProductUpdate.attributes["X-Shopify-Shop-Domain"],
        product_Id: JSON.parse(dataProductUpdate).id.toString(),
      },
      { product_name: JSON.parse(dataProductUpdate).title.toString() }
    )
      .then((success) => console.log("Product Update Successfully", success))
      .catch((err) => console.log("error in product update", err));
  };

// // productsAndOrders.post("/appUninstall", async (req, res) => {

// //      try {
// //         const appUnistall = (await req.body) ? req.body.message : null;
// //         await ProductSchema.deleteMany({shop: appUnistall.attributes["X-Shopify-Shop-Domain"]});
// //         await AppInstallations.delete(appUnistall.attributes["X-Shopify-Shop-Domain"]);
// //         console.log("App uninstall sucessfully")
// //         return res.sendStatus(204);
// //       }
// //       catch(e){
// //         console.log("Someting went wrong in pubsub",e.message);
// //         return res.sendStatus(400);
// //       }

// //     });
