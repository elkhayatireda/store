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
import customerRoutes from "./routes/customer.route.js";
import reviewRoutes from "./routes/review.route.js";
import couponRoutes from "./routes/coupon.route.js";
import http from 'http';
import Setting from './models/setting.model.js';
import orderEvents from './events/orderEvents.js'; 

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
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);

app.post('/api/settings', async (req, res) => {
  const { clientEmail, privateKey, sheetId, selectedColumns } = req.body;

    try {
        let settings = await Setting.findOne();

        if (settings) {
            settings.clientEmail = clientEmail;
            settings.privateKey = privateKey;
            settings.sheetId = sheetId;
            settings.selectedColumns = selectedColumns; // User-specified columns
        } else {
            settings = new Setting({
                clientEmail,
                privateKey,
                sheetId,
                selectedColumns,
            });
        }

        await settings.save();
        res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: 'Failed to save settings' });
    }
});
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


orderEvents.on('orderCreated', async (order) => {
  try {
    // Fetch credentials from the Settings model
    const settings = await Setting.findOne();
    if (!settings) {
      throw new Error('Google Sheets API credentials not found in settings');
    }
    const { clientEmail, privateKey, sheetId, selectedColumns } = settings;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'), // Replace newline characters in the private key
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

        // Mapping function to filter columns
        const mapOrderToColumns = (item) => {
            const mappedData = [];

            selectedColumns.forEach((column) => {
                switch (column) {
                    case 'Timestamp':
                        mappedData.push(new Date().toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }).replace(',', ''));
                        break;
                    case 'Order Reference':
                        mappedData.push(order.ref.toString().padStart(5, '0'));
                        break;
                    case 'Customer Name':
                        mappedData.push(order.guestInfo.fullName);
                        break;
                    case 'Customer Phone':
                        mappedData.push(order.guestInfo.phone);
                        break;
                    case 'Customer Address':
                        mappedData.push(order.guestInfo.address);
                        break;
                    case 'Product Title':
                        mappedData.push(item.title);
                        break;
                    case 'Product Variant':
                        mappedData.push(item.variant);
                        break;
                    case 'Quantity':
                        mappedData.push(item.quantity);
                        break;
                    case 'Unit Price':
                        mappedData.push(item.unitPrice);
                        break;
                    case 'Item Total Price':
                        mappedData.push(item.unitPrice * item.quantity);
                        break;
                    case 'Order Total Price':
                        mappedData.push(order.totalPrice);
                        break;
                    case 'Order Status':
                        mappedData.push(order.status);
                        break;
                    // Add other cases as needed
                    default:
                        break;
                }
            });

            return mappedData;
        };

        const orderData = order.items.map(mapOrderToColumns);

        for (const data of orderData) {
            const resource = { values: [data] };
            try {
                await sheets.spreadsheets.values.append({
                    spreadsheetId: sheetId,
                    range: 'orders!A1',
                    valueInputOption: 'RAW',
                    resource,
                });
            } catch (error) {
                console.error('Error appending order:', error);
            }
        }
  } catch (error) {
    console.error('Error during order creation:', error);
  }
});

export default app;