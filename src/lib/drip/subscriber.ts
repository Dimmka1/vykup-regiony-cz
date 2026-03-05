import { getRedis } from "./redis";
import type { DripSubscriber } from "./types";

const KEY_PREFIX = "drip:sub:";

export async function addSubscriber(
  email: string,
  name: string,
  region: string,
): Promise<void> {
  const redis = getRedis();
  const key = `${KEY_PREFIX}${email.toLowerCase()}`;
  const existing = await redis.get<DripSubscriber>(key);
  if (existing) return;

  const subscriber: DripSubscriber = {
    email: email.toLowerCase(),
    name,
    region,
    createdAt: new Date().toISOString(),
    lastSentDay: -1,
    unsubscribed: false,
  };
  await redis.set(key, subscriber);
  await redis.sadd("drip:active", email.toLowerCase());
}

export async function getSubscriber(
  email: string,
): Promise<DripSubscriber | null> {
  const redis = getRedis();
  return redis.get<DripSubscriber>(`${KEY_PREFIX}${email.toLowerCase()}`);
}

export async function updateSubscriber(
  email: string,
  update: Partial<DripSubscriber>,
): Promise<void> {
  const redis = getRedis();
  const key = `${KEY_PREFIX}${email.toLowerCase()}`;
  const existing = await redis.get<DripSubscriber>(key);
  if (!existing) return;
  await redis.set(key, { ...existing, ...update });
}

export async function unsubscribe(email: string): Promise<boolean> {
  const redis = getRedis();
  const key = `${KEY_PREFIX}${email.toLowerCase()}`;
  const existing = await redis.get<DripSubscriber>(key);
  if (!existing) return false;
  await redis.set(key, { ...existing, unsubscribed: true });
  await redis.srem("drip:active", email.toLowerCase());
  return true;
}

export async function getActiveSubscribers(): Promise<string[]> {
  const redis = getRedis();
  return redis.smembers("drip:active");
}
