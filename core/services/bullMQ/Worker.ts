import { Worker } from "bullmq";

console.log("ViewSync Worker Started");

export const worker = new Worker(
  "ViewSyncQueue",
  async (job) => {
    const { slug, visitorId } = job.data;

    console.log("chala");
    console.log("Processing job:", job.id);
    console.log("Data:", job.data);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Finished processing job:", job.id);
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);