// -----------------------------------------------Imports-------------------------------------------------------
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongo } from "./src/configs/db/mongo/mongoConfig.js";
import { corsConfig, envAccess } from "./src/utils/index.js";
import { CustomError } from "./src/utils/errors/customError.js";
// -------------------------------------------------------------------------------------------------------------
dotenv.config();

const app = express();
const PORT = envAccess("PORT") || 9898;
connectMongo();
// ------------------------------------------------------------------------------------------------------------
// ----------------------------------------------CORS HANDLING-------------------------------------------------
app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? {
          origin: [
            "https://hot-house.vercel.app",
            "https://hot-house-9gco.vercel.app",
            "http://localhost:4112",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5010",
            "http://localhost:4113",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:4114",
          ],
          credentials: true,
        }
      : {
          origin: [
            "https://hot-house.vercel.app",
            "https://hot-house-9gco.vercel.app",
            "http://localhost:4112",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5174",
            "http://localhost:5173",
            "http://localhost:5010",
            "http://localhost:4113",
            "http://localhost:4114",
          ],
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          credentials: true,
          maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
  )
);
// ------------------------------------------------------------------------------------------------------------
// ----------------------------------------------Middlewares----------------------------------------------------
// express.json() -- middleware to parse the json coming from the http request
app.use(express.json());

// cookieParser() -- middleware to parse the cookie coming from the http request
app.use(cookieParser());
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------Routes----------------------------------------------------

const versionOne = (url) => {
  return `/api/v1/${url}`;
};
const foodCustomization = (url) => {
  return `/api/v1/food/customization/${url}`;
};

// Router Imports
import { foodItemRouter } from "./src/routes/foodRoutes/foodItemRoutes.js";

import { baseCustomizationRouter } from "./src/routes/foodRoutes/foodCustomization/base.js";
import { sizeCustomizationRouter } from "./src/routes/foodRoutes/foodCustomization/size.js";
import { cheeseCustomizationRouter } from "./src/routes/foodRoutes/foodCustomization/cheese.js";
import { sauceCustomizationRouter } from "./src/routes/foodRoutes/foodCustomization/sauce.js";
import { meatToppingsCustomizationRouter } from "./src/routes/foodRoutes/foodCustomization/meatToppings.js";
import { vegetarianToppingsCustomizationRouter } from "./src/routes/foodRoutes/foodCustomization/vegetarianToppings.js";
import pizzaRoutes from "./src/routes/pizza/pizza.js";
import sidesRoutes from "./src/routes/sides.js";
import dessertRoutes from "./src/routes/dessert.js";
// Route Middlewares
import drinksRoutes from "./src/routes/drink.js";
import dipsRoutes from "./src/routes/dips.js";
import authRoutes from "./src/routes/authRoutes/authRoutes.js";
import adminAuth from "./src/routes/admin/auth.js";
import addressRoutes from "./src/routes/address.js";
import orderRoutes from "./src/routes/order.js";
import dealsRoutes from "./src/routes/deals/deals.js";
import morgan from "morgan";
// Route Middlewarespull origin gaurav-code

app.use(morgan("dev"));
app.all(["/", "/api", "/api/v1"], (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to Hot House",
  });
});

app.use(versionOne("food"), foodItemRouter); // Food Item Router

// Food Customization Router
app.use(foodCustomization("base"), baseCustomizationRouter);
app.use(foodCustomization("size"), sizeCustomizationRouter);
app.use(foodCustomization("cheese"), cheeseCustomizationRouter);
app.use(foodCustomization("sauce"), sauceCustomizationRouter);
app.use(foodCustomization("meatToppings"), meatToppingsCustomizationRouter);
app.use(
  foodCustomization("vegetarianToppings"),
  vegetarianToppingsCustomizationRouter
);

app.use("/api/v1/pizza", pizzaRoutes);
app.use("/api/v1/sides", sidesRoutes);
app.use("/api/v1/dessert", dessertRoutes);
app.use("/api/v1/drinks", drinksRoutes);
app.use("/api/v1/dips", dipsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth/adminSignUp", adminAuth);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/deals", dealsRoutes);

// -------------------------------------------------------------------------------------------------------------

// ------------------------------------------Global Error Handling----------------------------------------------
app.all("*", (req, res, next) => {
  return next(
    new CustomError(`Can't find the ${req.originalUrl} on the server`, 404)
  );
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message,
  });
});

// ------------------------------------------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running at port - ${PORT}`);
});
// ------------------------------------------------------------------------------------------------------------
