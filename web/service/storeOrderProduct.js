import { Shopify } from "@shopify/shopify-api";
import { ProductSchema } from "../database/productData.js";
import{orderSchema} from "../database/orderData.js" 

export async function storeOrderProduct(session) {
  const { Product } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const { Order } = await import(
    `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  );
  const allProductsSave = await Product.all({ session });
  // const allOrderSave = await Order.all({
  //   session,
  //   status: "any",
  // });
  allProductsSave.map(async (productData) => {
    let OrderAndProductData = new ProductSchema();
    OrderAndProductData.shop = session.shop;
    OrderAndProductData.product_Id = productData.id;
    OrderAndProductData.product_name = productData.title;
    await OrderAndProductData.save();
  });
  // let OrderAndProductData = new orderAndProductSchema();
  //    productArr.map((productData)=>{
  //       OrderAndProductData.shop=productData.shop;
  //       OrderAndProductData.product_Id = productData.product_Id;
  //       OrderAndProductData.product_name = productData.product_name;
  //       OrderAndProductData.save();
  //     })

  // const orderArr = allOrderSave.map((orderData) => {
  //   const finalOrderData = { Order_id: orderData.id };
  //   return finalOrderData;
  // });
  // console.log("productArr", productArr);
  // console.log("OrderArr", orderArr);
}
