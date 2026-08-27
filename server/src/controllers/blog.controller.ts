import { type Request, type Response } from "express";
import { getBlogContent } from "../utils/parse.js";
import { api } from "../../convex/_generated/api.js";
import { convex } from "../lib/convexClient.js";
import { generatePost } from "../utils/model.js";
import type { Id } from "../../convex/_generated/dataModel.js";

export const saveBlog = async (req: Request, res: Response) => {
  const { idempotency_key, user_id, post_url, content } = req.body;
  if (content) {

    try {
      const blogId = await convex.mutation(api.public.blog.saveBlog, {
        idempotency_key,
        user_id,
        content: content,
      });
      if (blogId) {
        return res.status(200).json({
          message: "sucess",
          blogId,
        });
      }
      else{
        throw new Error("Someting Went wrong.")
      }
      
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }



  } else if (post_url) {
    const blogContent = await getBlogContent(post_url);
    try {
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
      else{
        throw new Error("Someting Went wrong.")
      }
      
    } catch (error) {
      return res.status(500).json({
        message: "Someting Went wrong.",
      });
    }
  }
};

export const createPost = async(req: Request, res: Response)=>{
  const id = req.params.id as Id<"blog">;
  try {
    const blog = await convex.query(api.public.blog.getBlog, {
      id
    });
    if(blog){{
      const response = await generatePost(blog.content);
      console.log(response.variants)
    }}
    
  } catch (error) {
    console.error(error)
  }
}
