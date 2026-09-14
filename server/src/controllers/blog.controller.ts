import { type Request, type Response } from "express";
import { getBlogContent } from "../utils/parse.js";
import { generatePost } from "../utils/model.js";
import { db } from "../db/db.init.js";
import console from "node:console";
import { postPublishQueue } from "../lib/queue.js";

export const saveBlog = async (req: Request, res: Response) => {
  const { idempotency_key, user_id, post_url, content } = req.body;
  const {
    rows: [existing],
  } = await db.query(
    `SELECT *
        FROM idempotency_keys
        WHERE key = $1
        LIMIT 1`,
    [idempotency_key],
  );
  if (existing?.status === "completed") {
    const blog = await getBlogData(existing.result);
    return res.status(201).json({
      blogId: blog.rows[0].id,
      content: blog.rows[0].content,
      post_url: blog.rows[0].post_url,
    });
  }

  if (content) {
    try {
      const result = await db.query(
        `INSERT INTO blog (user_id, content, post_url)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [user_id, content, post_url],
      );
      if (result.rows[0].id) {
        await db.query(
          `INSERT INTO idempotency_keys (key, user_id, status, result)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
          [
            idempotency_key,
            user_id,
            "completed",
            JSON.stringify(result.rows[0].id),
          ],
        );
      }

      if (result.rows[0]) {
        return res.status(200).json({
          message: "sucess",
          blogId: result.rows[0].id,
          content: result.rows[0].content,
          post_url: result.rows[0].post_url,
        });
      } else {
        throw new Error("Someting Went wrong.");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
      });
    }
  } else if (post_url) {
    const blogContent = await getBlogContent(post_url);
    try {
      if (blogContent) {
        const result = await db.query(
          `INSERT INTO blog (user_id, content, post_url)
        VALUES ($1, $2, $3)
        RETURNING *`,
          [user_id, blogContent, post_url],
        );
        if (result.rows[0].id) {
          await db.query(
            `INSERT INTO idempotency_keys (key, user_id, status, result)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
            [
              idempotency_key,
              user_id,
              "completed",
              JSON.stringify(result.rows[0].id),
            ],
          );
        }

        return res.status(200).json({
          message: "sucess",
          blogId: result.rows[0].id,
          content: result.rows[0].content,
          post_url: result.rows[0].post_url,
        });
      } else {
        throw new Error("Someting Went wrong .");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Someting Went wrong.",
      });
    }
  }
};

export const createPost = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cannot find the blog data",
      });
    }
    const blog = await getBlogData(id);

    if (blog.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const existing = await getPostDataFromBlogId(id);
    if (existing.rows[0]) {
      console.log(existing);
      return res.status(201).json({
        postId: existing.rows[0].id,
        x_post: existing.rows[0].x_post,
        instagram_post: existing.rows[0].instagram_post,
        linkedin_post: existing.rows[0].linkedin_post,
      });
    }
    const { variants: response } = await generatePost(blog.rows[0].content);

    const result = await db.query(
      `INSERT INTO post (user_id, status, blog_id, x_post, linkedin_post, instagram_post)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [
        blog.rows[0].user_id,
        "draft",
        blog.rows[0].id,
        response[0].content,
        response[1].content,
        response[2].content,
      ],
    );
    return res.status(201).json({
      postId: result.rows[0].id,
      x_post: result.rows[0].x_post,
      instagram_post: result.rows[0].instagram_post,
      linkedin_post: result.rows[0].linkedin_post,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getBlogData = async (blog_id: string) => {
  const blog = await db.query(
    `SELECT *
        FROM blog
        WHERE id = $1
        LIMIT 1`,
    [blog_id],
  );
  return blog;
};

export const getPostDataFromBlogId = async (post_id: string) => {
  const blog = await db.query(
    `SELECT *
        FROM post
        WHERE blog_id = $1
        LIMIT 1`,
    [post_id],
  );
  return blog;
};

export const reviewPost = async (req: Request, res: Response) => {
  const { status }: { status: "approved" | "rejected" } = req.body;
  const id = req.params.id as string;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Cannot find the post ",
    });
  }

  try {
    const result = await db.query(
      `UPDATE post
     SET status = $1
     WHERE id = $2
     RETURNING status`,
      [status, id],
    );
    return res.status(200).json({
      sucess: true,
      result: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  const { scheduledTime } = req.body;
  const id = req.params.id as string;

  if (!id) {
    return res.status(400).json({
      sucess: false,
      message: "Cannot find the post data.",
    });
  }

  try {
    const post = await db.query(
      `
      SELECT * FROM post WHERE id = $1
      `,
      [id],
    );
    if (post.rows[0]) {
      if (post.rows[0].status !== "approved") {
        return res.status(400).json({
          sucess: false,
          message: "Post is not approved to publish",
        });
      }
      const publishAt = new Date(scheduledTime);
      const delayTime = publishAt.getTime() - Date.now();

      if (Number.isNaN(publishAt.getTime())) {
        throw new Error("Invalid scheduled date");
      }

      if (delayTime < 0) {
        throw new Error("Scheduled time must be in the future");
      }
      await postPublishQueue.add(
        "publish",
        {
          postId: id,
        },
        {
          delay: 30000,
        },
      );
      return res.status(201).json({
        sucess: true,
        message: "Task Scheduled Sucessfully."
      })
    } else {
      throw new Error("Post not found.");
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went Wrong",
      error: error,
      sucess: false,
    });
  }
};
