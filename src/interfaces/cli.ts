import { Command } from "commander";
import ServiceManager from "../model";
import { RateLimitPeriod as RateLimitPeriodEnum } from "../graphql/types";
import { RateLimitPeriod } from "../../prisma/types";
import { getResetDate } from "../helpers";

const program = new Command();

const formatService = (service: Awaited<ReturnType<typeof ServiceManager.getByName>>) => {
  if (!service) return null;
  
  return {
    name: service.name,
    enabled: service.isEnabled,
    currentUsage: service.currentUsage,
    rateLimit: service.rateLimit,
    period: service.rateLimitPeriod,
    resetAt: new Date(service.resetAt).toLocaleString(),
    admin: service.adminEmail,
  };
};

const viewCommand = program
  .command("view")
  .description("View API service status");

viewCommand
  .command("all")
  .description("List all API services")
  .action(async () => {
    const services = await ServiceManager.getAll();
    
    if (services.length === 0) {
      console.log("No services found");
      return;
    }
    
    services.forEach((service) => {
      const formatted = formatService(service);
      console.table(formatted);
    });
  });

viewCommand
  .command("service")
  .description("View specific API service status")
  .argument("<name>", "Service name")
  .action(async (name: string) => {
    const service = await ServiceManager.getByName(name);
    if (!service) {
      console.log(`Service ${name} not found`);
      return;
    }
    
    const formatted = formatService(service);
    console.table(formatted);
  });

const updateCommand = program
  .command("update")
  .description("Update API service");

updateCommand
  .command("status")
  .description("Enable/disable API service")
  .argument("<name>", "Service name")
  .option("-e, --enable", "Enable service")
  .option("-d, --disable", "Disable service")
  .action(async (name: string, options: { enable?: boolean; disable?: boolean }) => {
    const service = await ServiceManager.getByName(name);
    
    if (!service) {
      console.log(`Service ${name} not found`);
      return;
    }
    
    if (options.enable && options.disable) {
      console.log("Cannot both enable and disable");
      return;
    }
    
    const isEnabled = options.enable ?? !options.disable ?? service.isEnabled;
    
    await ServiceManager.update({
      name,
      data: { isEnabled }
    });
    
    console.log(`Service ${name} ${isEnabled ? "enabled" : "disabled"}`);
  });

updateCommand
  .command("limit")
  .description("Update API service limit")
  .argument("<name>", "Service name")
  .argument("<limit>", "New limit")
  .option("-p, --period <period>", "Rate limit period (second, minute, hour, day, week, month, year)")
  .action(async (name: string, limit: string, options: { period?: RateLimitPeriod }) => {
    const service = await ServiceManager.getByName(name);
    
    if (!service) {
      console.log(`Service ${name} not found`);
      return;
    }
    
    const rateLimit = parseInt(limit, 10);
    
    if (isNaN(rateLimit) || rateLimit < 0) {
      console.log("Invalid limit value");
      return;
    }
    
    const updateData: Parameters<typeof ServiceManager.update>[0]["data"] = {
      rateLimit
    };
    
    if (options.period) {
      updateData.rateLimitPeriod = options.period as RateLimitPeriod;
      updateData.resetAt = getResetDate(options.period.toUpperCase() as RateLimitPeriodEnum);
    }
    
    await ServiceManager.update({
      name,
      data: updateData
    });
    
    console.log(`Updated limit for ${name}`);
    const updated = await ServiceManager.getByName(name);
    console.table(formatService(updated));
  });

updateCommand
  .command("usage")
  .description("Update API service usage")
  .argument("<name>", "Service name")
  .argument("<usage>", "New usage value")
  .action(async (name: string, usage: string) => {
    const service = await ServiceManager.getByName(name);
    
    if (!service) {
      console.log(`Service ${name} not found`);
      return;
    }
    
    const currentUsage = parseInt(usage, 10);
    
    if (isNaN(currentUsage) || currentUsage < 0) {
      console.log("Invalid usage value");
      return;
    }
    
    await ServiceManager.update({
      name,
      data: { currentUsage }
    });
    
    console.log(`Updated usage for ${name}`);
    const updated = await ServiceManager.getByName(name);
    console.table(formatService(updated));
  });

program.parse();