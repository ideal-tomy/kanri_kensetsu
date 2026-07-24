import { Redis } from "@upstash/redis";

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;
  if (!client) {
    client = Redis.fromEnv();
  }
  return client;
}

export function persistKey(companyCode: string, kind: "reports" | "photos" | "notifications") {
  return `kanri:${companyCode}:${kind}`;
}
