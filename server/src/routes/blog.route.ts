import { Router } from "express";
import { saveBlog } from "../controllers/blog.controller.js";

export const blogRouter = Router()

blogRouter.route("/new").post(saveBlog)