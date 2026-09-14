import { Worker, Queue } from "bullmq";
import { redisConnection } from "../db/redis.init";

export const postPublishQueue = new Queue('post publish',{
  connection: redisConnection
});

const worker = new Worker(
  "post publish",
  async (job) => {
    console.log(`Processing job ${job.id}`);
    console.log("Job data:", job.data);
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});