import { asyncErrorHandler } from "../utils/errors/asyncErrorHandler.js";
import { CustomError } from "../utils/errors/customError.js";
import drinks from "../models/drinks.js";

export const newDrink = asyncErrorHandler(async (req, res, next) => {
  const { price, banner, drink } = req?.body;
  const newDrinkData = await drinks.create({
    banner: req?.file?.path,
    price: JSON.parse(price),
    drink,
  });
  res
    .status(201)
    .json({ status: true, message: "New drink created successfully!!" });
});

export const getAllDrink = asyncErrorHandler(async (req, res, next) => {
  const data = await drinks.find();
  res.status(200).json({ status: true, data });
});
