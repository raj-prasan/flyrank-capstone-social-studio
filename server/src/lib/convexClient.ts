import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";

dotenv.config({
  path: ".env.local",
});


export const convex  = new ConvexHttpClient(process.env.CONVEX_URL!)