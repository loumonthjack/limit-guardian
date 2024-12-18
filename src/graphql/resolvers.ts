import { MutationNewServiceArgs, QueryServiceArgs, RateLimitPeriod } from "./types";
import ServiceManager from "../model";
import { getResetDate, getRateLimitPeriod } from "../helpers";

export default {
  Query: {
    services: async (_: void, args: void) => {
      return await ServiceManager.getAll();
    },
    service: async (_: void, args: QueryServiceArgs) => {
      return await ServiceManager.getByName(args.name);
    },  
  },
  Mutation: {
    newService: async (_: void, args: MutationNewServiceArgs) => {
        const name = args.name.replace(/\s+/g, '-').toLowerCase();
        args.name = name;

      return await ServiceManager.create({
        ...args,
        currentUsage: 0,
        resetAt: getResetDate(args.rateLimitPeriod.toUpperCase() as RateLimitPeriod),
        rateLimitPeriod: getRateLimitPeriod(args.rateLimitPeriod)
      });
    },
  },
};
