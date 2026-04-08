import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import complaintRouter from "./routes/complaintRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "10mb" })); // handle large base64 images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // set your frontend URL in .env
    credentials: true,
  })
);

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/complaints", complaintRouter); // pluralized for clarity

// Connect to MongoDB and start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB or start server:", err);
    process.exit(1);
  }
})();