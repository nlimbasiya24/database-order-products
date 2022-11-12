import { AppInstallations } from "../app_installations.js";
import { AppUninstallPubSubService } from "../service/appUninstallService.js";

export const AppUninstallPubSubController= async (req, res) => {

     try {
        const appUnistall = await req.body.message;
        AppUninstallPubSubService(appUnistall);
        await AppInstallations.delete(appUnistall.attributes["X-Shopify-Shop-Domain"]);
        console.log("App uninstall sucessfully")
        return res.sendStatus(204);
      }
      catch(e){
        console.log("Someting went wrong in pubsub",e.message);
        return res.sendStatus(400);
      }

    }
