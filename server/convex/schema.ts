import { defineTable, defineSchema } from "convex/server";
import {v} from "convex/values"

export default defineSchema({
  blog: defineTable({
    user_id: v.string(),
    content: v.string(),
    post_url : v.optional(v.string()),
    
  }).index("by_user_id", ["user_id"]),
  idempotency_keys: defineTable({
    key: v.string(),
    user_id: v.string(),
    status : v.union(
      v.literal("processing"),
      v.literal("failed"),
      v.literal("completed"),

    ),
    result : v.optional(v.any())
  }).index("by_idempotency_key", ["key"]).index("by_user_id", ["user_id"]),
  post: defineTable({
    user_id: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("published"),
    ),
    blog_id: v.id("blog"),
    Xpost: v.string(),
    InstagramPost: v.string(),
    LinkedInPost : v.string()
  }).index("by_user_id", ["user_id"]).index("by_blog_id", ["blog_id"])
})