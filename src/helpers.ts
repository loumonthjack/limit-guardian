import { RateLimitPeriod } from "../prisma/prisma.types";
import { RateLimitPeriod as RateLimitPeriodEnum } from "./graphql.types";

export const MILLISECONDS = {
  SECOND: 1_000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
  DAY: 86_400_000,
  WEEK: 604_800_000,
  MONTH: 2_629_746_000,
  YEAR: 31_556_952_000,
} as const;

export const getResetDate = <T extends keyof typeof MILLISECONDS>(period: T): Date => {
  return new Date(Date.now() + MILLISECONDS[period]);
};

export const getRateLimitPeriod = (period: RateLimitPeriodEnum): RateLimitPeriod => {
  return {
    [RateLimitPeriodEnum.Second]: "second",
    [RateLimitPeriodEnum.Minute]: "minute",
    [RateLimitPeriodEnum.Hour]: "hour",
    [RateLimitPeriodEnum.Day]: "day",
    [RateLimitPeriodEnum.Week]: "week",
    [RateLimitPeriodEnum.Month]: "month",
    [RateLimitPeriodEnum.Year]: "year",
  }[period] as RateLimitPeriod;
};

export const calculateCronPattern = (period: string): string => {
  const patterns = {
    "second": "* * * * * *",
    "minute": "0 * * * * *",
    "hour": "0 0 * * * *",
    "day": "0 0 0 * * *",
    "week": "0 0 0 * * 0",
    "month": "0 0 0 1 * *",
    "year": "0 0 0 1 1 *"
  } as const;
  
  return patterns[period as keyof typeof patterns] || "0 0 * * * *";
};