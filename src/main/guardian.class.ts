import { GuardianConfig, GuardianError } from "./types";
import ServiceManager from "../model";
import { getResetDate } from "../helpers";
import { RateLimitPeriod } from "../graphql/types";
import { sendEmail, formatLimitWarningEmail } from "../services/email";
import { Prisma } from "@prisma/client";

export class Guardian {
  private static instance: Guardian;
  private constructor() {}

  static getInstance(): Guardian {
    if (!Guardian.instance) {
      Guardian.instance = new Guardian();
    }
    return Guardian.instance;
  }

  private async ensureService(name: string, config: GuardianConfig) {
    try {
      const service = await ServiceManager.getByName(name);
      
      if (!service) {
        return await ServiceManager.create({
          name,
          description: `Auto-created service for ${name}`,
          isEnabled: true,
          rateLimitPeriod: config.interval,
          rateLimit: config.limit,
          adminEmail: config.to || "admin@example.com",
          currentUsage: 0,
          resetAt: getResetDate(config.interval.toUpperCase() as RateLimitPeriod),
        });
      }
      
      return await ServiceManager.update({
        name,
        data: {
          rateLimitPeriod: config.interval,
          rateLimit: config.limit,
          adminEmail: config.to || service.adminEmail,
          updatedAt: new Date(),
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const service = await ServiceManager.getByName(name);
        if (service) {
          return service;
        }
      }
      throw error;
    }
  }

  private async notifyLimitReached(
    service: Awaited<ReturnType<typeof ServiceManager.getByName>>,
    config: GuardianConfig
  ) {
    if (!service || !config.to) return;
    
    const text = formatLimitWarningEmail(
      service.name,
      service.currentUsage,
      service.rateLimit,
      getResetDate(config.interval.toUpperCase() as RateLimitPeriod)
    );

    await sendEmail({
      to: config.to,
      subject: `Rate Limit Warning: ${service.name}`,
      text,
    });
    
    await ServiceManager.update({
      name: service.name,
      data: {
        lastNotified: new Date(),
      },
    });
  }

  private async checkLimit(name: string, config: GuardianConfig): Promise<GuardianError | null> {
    const service = await ServiceManager.getByName(name);
    
    if (!service) {
      throw {
        message: `Service ${name} not found`,
        code: "SERVICE_NOT_FOUND",
        service: name,
        limit: 0,
        usage: 0,
        resetAt: new Date(),
      } as GuardianError;
    }

    if (!service.isEnabled) {
      throw {
        message: `Service ${name} is disabled`,
        code: "SERVICE_DISABLED",
        service: name,
        limit: service.rateLimit,
        usage: service.currentUsage,
        resetAt: new Date(service.resetAt),
      } as GuardianError;
    }

    if (service.currentUsage >= service.rateLimit) {
      const error = {
        message: `Rate limit exceeded for ${name}`,
        code: "RATE_LIMIT_EXCEEDED",
        service: name,
        limit: service.rateLimit,
        usage: service.currentUsage,
        resetAt: new Date(service.resetAt),
      } as GuardianError;

      await this.notifyLimitReached(service, config);

      if (config.strict) {
        throw error;
      }
      
      return error;
    }

    return null;
  }

  private async incrementUsage(name: string): Promise<void> {
    try {
      const service = await ServiceManager.getByName(name);
      if (!service) {
        throw new Error(`Service ${name} not found`);
      }

      await ServiceManager.update({
        name,
        data: {
          currentUsage: service.currentUsage + 1,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Failed to increment usage for ${name}:`, error);
      throw error;
    }
  }

  async protect<T>(
    name: string,
    callable: T,
    config: GuardianConfig,
  ) {
    await this.ensureService(name, config);
    const limitError = await this.checkLimit(name, config);

    if (limitError && !config.strict) {
      console.log(`Warning: ${limitError.message} (non-strict mode)`);
    }

    try {
      await this.incrementUsage(name);
      return callable;
    } catch (error) {
      await this.incrementUsage(name);
      throw error;
    }
  }
} 