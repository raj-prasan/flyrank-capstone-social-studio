import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server.js";

export const saveBlog = mutation({
  args: {
    idempotency_key: v.string(),
    user_id: v.string(),
    content: v.string(),
    post_url : v.optional(v.string())
  },
  handler: async(ctx,args)=>{
    const existing = await ctx.db.query("idempotency_keys").withIndex("by_idempotency_key", (q)=>q.eq("key", args.idempotency_key)).unique();

    if(existing?.status === "completed"){
      return existing.result
    }
    else{
      const blogId = await ctx.db.insert("blog", {
        content: args.content,
        user_id : args.user_id,
        ...(args.post_url !== undefined && {post_url: args.post_url})
      })
      await ctx.db.insert("idempotency_keys", {
        key: args.idempotency_key,
        status: "completed",
        user_id: args.user_id,
        result : "completed"
      })
      return blogId;
    }
  }
})

export const getBlog = query({
  args: {
    id: v.id("blog")
  },
  handler : async(ctx, args)=>{
    const blog = ctx.db.get(args.id);
    return blog
  }

})

/* export const getPost =  */