// ---------------------------------------------Imports----------------------------------------------------
import express from "express";
import { createSauceCustomization, deleteSauceCustomization, getAllSauceCustomization, updateSauceCustomization } from "../../../controllers/foodController/foodCustomization/sauce.js";
// --------------------------------------------------------------------------------------------------------

export const sauceCustomizationRouter = express.Router();

sauceCustomizationRouter.route("/:id").patch(updateSauceCustomization).delete(deleteSauceCustomization);

sauceCustomizationRouter.route("/").get(getAllSauceCustomization).post(createSauceCustomization);;
