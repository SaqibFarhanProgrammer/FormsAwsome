import { Queue } from "bullmq";
export const ViewSyncQueue = new Queue("ViewSyncQueue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});


