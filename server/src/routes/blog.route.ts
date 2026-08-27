import { Router } from "express";
import { createPost, saveBlog } from "../controllers/blog.controller.js";

export const blogRouter = Router()

blogRouter.route("/new").post(saveBlog)
blogRouter.route("/generate/:id").post(createPost)