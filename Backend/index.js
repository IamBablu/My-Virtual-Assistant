import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import geminiResponse  from "../Backend/gemini.js";

const app = express();
const port = process.env.PORT || 8000;
app.use(cors({
  origin: 'https://my-virtual-assistant-4y7t.onrender.com', // Slash mat lagana
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/virtual-assistant/api/V1/auth", authRouter);
app.use("/virtual-assistant/api/V1/user", userRouter);









app.listen(port, () => {
  connectDB();
  console.log(`hii Bablu ${port}`);
});

