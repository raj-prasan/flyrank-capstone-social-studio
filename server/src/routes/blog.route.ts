import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getBlogById,
  getPostById,
  publishPost,
  reviewPost,
  saveBlog,
} from "../controllers/blog.controller.js";

export const blogRouter = Router();

blogRouter.route("/new").post(saveBlog);
blogRouter.route("/generate/:id").post(createPost);
blogRouter.route("/review/:id").post(reviewPost);
blogRouter.route("/publish/:id").post(publishPost);
blogRouter.route("/post/:id").get(getPostById);
blogRouter.route("/posts").get(getAllPosts);
blogRouter.route("/blog/:id").get(getBlogById);
