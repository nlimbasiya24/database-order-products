import {
  productCreatePubSubController,
  productDeletePubSubController,
  productUpdatePubSubController
} from "../../controller/productSavedController.js";
import express from "express";
 
export const productSavedDB = express.Router();

productSavedDB.post("/productCreate", productCreatePubSubController);

productSavedDB.post("/productDelete",productDeletePubSubController);

productSavedDB.post("/productUpdate",productUpdatePubSubController);


