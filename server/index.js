import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/admin.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import http from 'http';
import { initSocket } from './services/socket.js';

const app = express(); 
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["content-type", "Authorization"],
    credentials: true,
  })
);
const server = http.Server(app);
const io = initSocket(server);
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch((error) => {
    console.error(`something went wrong while connecting to database: ${error}`);
  });

server.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(`Error starting server: ${error}`);
  } else {
    console.log(`server is running on the port ${process.env.PORT}`);
  }
});


app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);


export default app;