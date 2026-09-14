import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { blogRouter } from "./routes/blog.route.js";


const app = express();
app.use(cors());

app.use(express.json({ limit: "16Kb" }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    name: "Social Media Studio API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok"
  });
});

app.use("/api/v1", blogRouter)

export { app };
