import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adminRoutes from "./routes/admin.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import http from 'http';


const app = express(); 
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["content-type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch((error) => {
    console.error(`something went wrong while connecting to database: ${error}`);
  });

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(`Error starting server: ${error}`);
  } else {
    console.log(`server is running on the port ${process.env.PORT}`);
  }
});

app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// server.js (or your main server file)
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message); // Log the error
    if (err.message.includes('File size too large')) {
      return res.status(400).json({ message: 'File size too large. Max size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Max size is 5MB.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
  next();
});

export default app;