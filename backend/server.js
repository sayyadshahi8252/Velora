import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import userRouter from "./src/routes/userRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import cartRouter from "./src/routes/cartRoute.js";
import orderRouter from "./src/routes/orderRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "1mb" })); // increase limit
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://velora-frontend-iota.vercel.app',
    'https://velora-admin-ebon.vercel.app'
  ],
  credentials: true
}));

// Debug logs
app.use((req, res, next) => {
  console.log('Request:', req.method, req.path, 'Origin:', req.headers.origin);
  next();
});

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Health check
app.get("/", (req, res) => {
    res.send("api working successfully");
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
