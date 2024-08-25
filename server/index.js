import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import  { google } from "googleapis";
import cors from "cors";
import adminRoutes from "./routes/admin.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import couponRoutes from "./routes/coupon.route.js";
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
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);

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


async function initializeAuth(clientEmail, privateKey) {
  const auth = new google.auth.GoogleAuth({
      credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

// Function to append a new order to the Google Sheet.
async function appendOrder(auth, spreadsheetId, orderData) {
  const sheets = google.sheets({ version: 'v4', auth });
  const resource = {
      values: [orderData], // New row to append
  };

  try {
      const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'orders!A1', // Change to your specific sheet name and starting range
          valueInputOption: 'RAW',
          resource,
      });
      console.log('Order appended:', response.data.updates);
  } catch (error) {
      console.error('Error appending order:', error);
  }
}

// Example usage
(async () => {
  const clientEmail = 'bronigga@ethereal-argon-427022-r2.iam.gserviceaccount.com'; 
  const privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3bDNr2FPrNen3\nOqBs1U2ZthRyxEbM2jNZt5cf818Yk2kEP2hE32MRUL++vJEoxzwvYWQ+D3352VqZ\nmO8F51hV4MWs6GD4Fs9n8jfgPXJ3utoxqbmV+Dcm0H9CQe6kye3O2Bj/OXHitJbj\n1DPpsUTdA4xxi7fnIohUD56YTmfLAMwKH4iqxcqH/MejftECUduaahVFbUhZOaUW\nAvUdgpfp2VWUagQyonCR0aQrzbE3j9sIpqXNFq/PEdffEqhxz6yDvhV0HSHzXKTy\nUu2UwEgUXbQRGYbwQ6nIRfjAuEw5dWJ2jwiYTqB+okVW6hv1WkkGnPKLNyP3c16T\nVMiKZiQFAgMBAAECggEAEmRfnZtCAu5TiQ5QYslasCSRVVa4ELd6ea8OkM4bBYBW\nge4Huww5R1W0/F+1IIUl1ExsPEraY3C3hHpQ0WM6uNXCjI16l7XV00L29l3C+h16\n3or5yH9srFAwyoiI8O4skdaaXxE4Cbb5AFxZXj//uzetX/9WD++nAuLUEMqf3ruI\nt5BWdAfcv4f2n26CGOGfOeCkcm/yCeDHlmmO5xFFJ0UCzqfY6hKYzpX1ayCyc1WE\nH1qDu/9nKCDEAVPFVVkslqbd9EjbY+hfzai/ZB9EI8h8FBa+wTBXLw2cJ138/T1i\nzEepBEww5H14HHGojTHiqsAej2sPf15SGIEo67wB0QKBgQDjqIh7BNLO5QzVxY9e\nYt60WZkBCaNaxV83NVtJBH8L3JVzPSg0BY2CMsESRU7eNkOffPqA5rnu5sTHsqqQ\njn6lwCwGHy4LHMjiija+F3UJvvsVUI025GHrSlFZeEtpf8tj6dDhY0OcPlj3IcFe\n+lHI2dDLa2e4qKe0b1zoR7Vj/QKBgQDOQeCt/yV1jcGjtKMDxw9EBbS50Dc4Zk0Z\nCw2Rszb/3eNeDxW7THrdTSxsYd1oFr6SCIB9i0IVAy8K1TZNGOt4Z9mjOQKAhAnT\nvafcUr9re1LZKfhdD3FNYxp1wbCswx2iUJOj9zsor/+Tv2dhOahXyqzl3w98WpY8\n2yFAE8BKqQKBgDZMSRkGQn1kNhZ6g0Jg1Hsxb4PG17ZbouUZDcexkdezadXNfVxD\nAshN8Ky56SCo0qIkfd7mqOwpEEANBg9qXRyNZDKllybBW8xkaMAX+isz6NDhoHy6\nJfynghWT0nC8MTeIWfCX61VFrZRr8aIElCMSiHEsEdYCK9WmRgOErufFAoGAJa2b\nIa3uZd8TdJhW/yWqAD8amKcUr1Tg2KZQQEGA1pTuKAyRZ7m86Bhk+ReXnqApB/xN\nnKGH3NbMDSqN1N+shD5UX6DWeCumr+uBcpobJcNNiyZDnJxpkj18Y+6SG704+KHH\nlrhfMjuUcKUSeYxS2FbJ5uQsrAbQUyWkmVQCWKECgYEAgVx0QL1roWLkP7TjtAJb\np7vdkWW3CROPVkGhQOLs2+pq3bfqXYgEqVvAwuxOeY01/tH+G+d8sRTWBqQyPOvJ\n69N/Qr7zzcfe6CYTo6MEEqhSPA//GFYtfr7nQqZT+ZA8eJEraA4VL/NRhqv0uDJg\nxtsL8W5Yn41hGn+304QRuUw=\n-----END PRIVATE KEY-----\n'; // Replace with user input
  const spreadsheetId = '1fht5HqE86TapuNkMKGj9JSccUmEYukhYcqtaiWyxVvE';  

  const auth = await initializeAuth(clientEmail, privateKey);

  const newOrder = [
      new Date().toISOString(), // Timestamp
      '12345',                 // Order ID
      'John Doe',              // Customer Name
      '2',                     // Quantity
      '$29.99',                // Unit Price
      '$59.98'                 // Total Price
      // Add more fields as needed
  ];

  await appendOrder(auth, spreadsheetId, newOrder);
})();
export default app;