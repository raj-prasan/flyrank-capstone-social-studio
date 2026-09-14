import { Router } from "express";
import { createPost, publishPost, reviewPost, saveBlog } from "../controllers/blog.controller.js";

export const blogRouter = Router()

blogRouter.route("/new").post(saveBlog)
blogRouter.route("/generate/:id").post(createPost)
blogRouter.route("/review/:id").post(reviewPost)
blogRouter.route("/publish/:id").post(publishPost)
