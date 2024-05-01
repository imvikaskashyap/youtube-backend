import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";
import dbConnect from "./db/db.js";

dbConnect()

dotenv.config({
    path:"./env"
})
const app = express();




/*
;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    app.on("error", (error) => {
      console.log("ERR : ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on PORT : ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR :", error);
    throw error;
  }
})();
*/