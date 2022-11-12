import express from "express";
import {AppUninstallPubSubController} from "../../controller/appUninstallController.js"

export const AppUninstallDB = express.Router();

 AppUninstallDB.post("/appUninstall", AppUninstallPubSubController);
