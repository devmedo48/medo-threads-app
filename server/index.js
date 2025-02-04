import { configDotenv } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import database from "./config/database.js";
import mountRoutes from "./routes/index.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import path from "path";

configDotenv();
database();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mountRoutes(app);

app.use((error, req, res, next) => {
  res.status(error.status).json({
    message: error.message,
    success: false,
  });
});
let __dirname = path.resolve();
let isProduction = process.env.NODE_ENV.startsWith("p");

if (isProduction) {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let port = process.env.PORT || 3000;
server.listen(port, () => console.log("server is working"));
