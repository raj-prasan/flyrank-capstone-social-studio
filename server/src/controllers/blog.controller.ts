import { type Request, type Response } from "express";
import { getBlogContent } from "../utils/parse.js";
import { api } from "../../convex/_generated/api.js";
import { convex } from "../lib/convexClient.js";

export const saveBlog = async (req: Request, res: Response) => {
  const { idempotency_key, user_id, post_url, content } = req.body;
  let blogContent;
  if (content) {
    blogContent = content;
    const blogId = await convex.mutation(api.public.blog.saveBlog, {
      idempotency_key,
      user_id,
      content: blogContent,
    });
    if (blogId) {
      return res.status(200).json({
        message: "sucess",
        blogId,
      });
    }
    return res.status(500).json({
      message: "Someting Went wrong.",
    });
  } else if (post_url) {
    blogContent = await getBlogContent(post_url);
    if (blogContent) {
      const blogId = await convex.mutation(api.public.blog.saveBlog, {
        idempotency_key,
        user_id,
        post_url,
        content: blogContent,
      });

      return res.status(200).json({
        message: "sucess",
        blogId,
      });
    }
    return res.status(500).json({
      message: "Someting Went wrong.",
    });
  }
};
