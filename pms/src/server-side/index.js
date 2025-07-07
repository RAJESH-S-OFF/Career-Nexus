import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.js";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", UserRouter);
mongoose
  .connect(
    "mongodb+srv://user:123@cluster0.kvq4q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("from backend"))
  .catch((err) => console.log(err));
app.listen(process.env.PORT, () => {
  console.log(`Server is running`);
});
