import prisma from "../client";
import { Service } from "../types";
import { createId } from "@paralleldrive/cuid2";

const main = async () => {
  const service: Service = {
    id: `srv_${createId()}`,
    name: "openai-api",
    description: "OpenAI API",
    rateLimitPeriod: "month",
    rateLimit: 1_000_000,
    adminEmail: "admin@example.com",
    isEnabled: true,
    currentUsage: 0,
    resetAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    lastNotified: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const createdService = await prisma.service.create({
    data: service,
  });
  console.log(`Created service: ${createdService.name}`);
};

main();

