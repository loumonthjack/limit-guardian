export type GuardianConfig = {
  interval: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
  limit: number;
  strict: boolean;
  to?: string;
};

export type GuardianError = {
  message: string;
  code: "RATE_LIMIT_EXCEEDED" | "SERVICE_DISABLED" | "SERVICE_NOT_FOUND";
  service: string;
  limit: number;
  usage: number;
  resetAt: Date;
}; 