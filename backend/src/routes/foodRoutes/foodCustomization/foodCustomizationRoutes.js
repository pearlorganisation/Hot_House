// ---------------------------------------------Imports----------------------------------------------------
import express from "express";
import { upsertFoodCustomization } from "../../../controllers/foodController/foodCustomization/foodCustomizationController.js";
// --------------------------------------------------------------------------------------------------------

export const foodCustomizationRouter = express.Router();
foodCustomizationRouter.route("/").put(upsertFoodCustomization);

// upsertCustomization