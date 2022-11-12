
import {
  productCreatePubSubService,
  productDeletePubSubService,
  productUpdatePubSubService,
} from "../service/productSavedService.js";



export const productCreatePubSubController = async (req, res) => {

  try{
      const messageProductCreate = await req.body.message; 
      productCreatePubSubService(messageProductCreate);
      return res.sendStatus(204);
    }catch(e){
      console.log("There is a some error in google pubsub")
      return res.sendStatus(400);
    }
   
  }

export const productDeletePubSubController = async (req, res) => {
    
    try {
      const messageProductDelete = req.body.message;
      productDeletePubSubService(messageProductDelete);
       return res.sendStatus(204);
        }
      catch(e){
        console.log("Something wrong in pubsub",e.message)
        return res.sendStatus(400);
      }
  
  }

export const productUpdatePubSubController = async (req, res) => {
  try{
        const messageProductUpdate =  req.body.message ;
        productUpdatePubSubService(messageProductUpdate);
        return res.sendStatus(204);
    }catch(e){
      console.log("There is some error from google pub sub")
      return res.sendStatus(400);
    }
  }







