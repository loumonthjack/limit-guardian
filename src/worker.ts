import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import env from "./env";
import ServiceManager from "./model";
import { calculateCronPattern, getResetDate } from "./helpers";

const createRedisConnection = () => new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const resetQueue = new Queue("reset-limits", {
  connection: createRedisConnection(),
});

const scheduleReset = async () => {
  const services = await ServiceManager.getAll();
  
  services.forEach(async (service) => {
    if (!service.isEnabled) return;
    
    await resetQueue.add(
      `reset-${service.name}`,
      { serviceId: service.id, period: service.rateLimitPeriod },
      { 
        repeat: {
          pattern: calculateCronPattern(service.rateLimitPeriod)
        }
      }
    );
  });
};

const startWorker = () => {
  const worker = new Worker(
    "reset-limits",
    async (job) => {
      const { serviceId, period } = job.data;

      await ServiceManager.update({
        id: serviceId,
        data: {
          currentUsage: 0,
          resetAt: getResetDate(period.toUpperCase()),
          lastNotified: null,
          updatedAt: new Date()
        }
      });
      
      console.log(`Reset usage for service ${serviceId}`);
    },
    { connection: createRedisConnection() }
  );
  
  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });
  
  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} ${job?.data?.serviceId} failed:`, err);
  });
  
  return worker;
};

const start = async () => {
  await scheduleReset();
  startWorker();
  console.log("Monitoring services at", `http://${env.REDIS_HOST}:${env.REDIS_PORT}`);
};

export default start;
