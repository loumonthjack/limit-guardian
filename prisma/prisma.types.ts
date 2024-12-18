import { Service as ServiceType } from "@prisma/client";

const rateLimitPeriods = {
    SECOND: "second",
    MINUTE: "minute",
    HOUR: "hour",
    DAY: "day",
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
} as const;

export type RateLimitPeriod = (typeof rateLimitPeriods)[keyof typeof rateLimitPeriods];

export type Service = ServiceType & {
    rateLimitPeriod: RateLimitPeriod;
}
